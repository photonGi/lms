import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { User } from "../models/user.model.js";
import { Lecture } from "../models/lecture.model.js";

const stripe = new Stripe(process.env.SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Stripe expects amount in smallest currency unit
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTENT_URL}/course-progress/${courseId}`,
      cancel_url: `${process.env.FRONTENT_URL}/course-detail/${courseId}`,
      metadata: {
        courseId,
        userId,
      },
      shipping_address_collection: {
        allowed_countries: ["PK"], // optional
      },
    });

    if (!session.url) {
      return res.status(400).json({
        success: false,
        message: "Failed to create checkout session",
      });
    }

    // Save purchase with Stripe session ID
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating checkout session",
    });
  }
};

// export const stripeWebhook = async (req, res) => {
//   let event;
//   try {
//     const payloadString = json.stringify(req.body, null, 2);
//     const secret = endPoint;// endpoint for secret key

//     const header = stripe.webhooks.generateTestHeaderString({
//       payload: payloadString,
//       secret
//     });

//     event = stripe.webhooks.constructEvent(payloadString, header, secret);
//   } catch (error) {
//     console.error("Webhook error:", error.message);
//     return res.status(400).send(`Webhook error: ${error.message}`)
//   }
// }
export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.STRIPE_WEBHOOK_SECRET; // Use a defined env variable

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // ✅ MUST BE INSIDE THIS FUNCTION
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }

      purchase.status = "completed";

      // Make all lectures visible
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreViewFree: true } }
        );
      }

      await purchase.save();

      // Enroll user
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      // Add student to course
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );

    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // ✅ Must respond with 200 for all handled webhooks
  res.status(200).send();
};

//Handle the checkout session compeleted event
if (event.type === "checkout.session.completed") {
  try {
    const session = event.data.object;
    const purchase = await CoursePurchase.findOne({
      paymentId: session.id,
    }).populate({ path: "courseId" });

    if (!purchase){
      return res.status(404).json({ message: "Purchase not found" })
    }

    if (session.amount_total) {
      purchase.amount = session.amount_total / 100;
    }
    purchase.status = "completed";

    // Male all lecture visible by setting isPreviewFree to true
    if (purchase.courseId && purchase.courseId.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: purchase.courseId.lectures } },
        { $set: { isPreViewFree: true } }
      );
    }
    await purchase.save();

    // Update user's enrolledCourses
    await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course id to
      { new: true }
    );

    // Update course to add user ID to enrolled Students
    await Course.findByIdAndUpdate(
      purchase.courseId._id,
      { $addToSet: { enrolledStudents: purchase.userId } }, // Add user id to
      { new: true }
    );

  } catch (error) {
    console.error("Error handling event:", error);
    return res.status(500).json({ message: "Internal server error" })
  }
  res.status(200).send();
};


export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
    .populate({ path: "creator" })
    .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
      console.log(purchased)
    }
    return res.status(200).json({
      course,
      purchased: !!purchased // ture if purhased, false otherwise
    })
  } catch (error) {
    console.log(error)
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({ status: "completed" }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

