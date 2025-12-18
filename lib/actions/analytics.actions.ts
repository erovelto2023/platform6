"use server";

import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import Course from "@/lib/db/models/Course";
import User from "@/lib/db/models/User";

export async function getAnalytics() {
    try {
        const { userId } = await auth();
        if (!userId) return { totalUsers: 0, courseStats: [] };

        await connectDB();

        const totalUsers = await User.countDocuments();
        const courses = await Course.find({});
        const users = await User.find({}).select('progress');

        const courseStats = courses.map(course => {
            let startedCount = 0;

            users.forEach(user => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const progress = user.progress?.find((p: any) => p.courseId.toString() === course._id.toString());
                if (progress) {
                    startedCount++;
                }
            });

            return {
                title: course.title,
                startedCount
            };
        });

        return {
            totalUsers,
            courseStats
        };
    } catch (error) {
        console.error("Analytics error:", error);
        return {
            totalUsers: 0,
            courseStats: []
        };
    }
}
