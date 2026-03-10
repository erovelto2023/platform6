import { getSubscribers } from "@/lib/actions/subscriber.actions";
import SubscriberManager from "@/components/admin/SubscriberManager";

export default async function SubscribersAdminPage() {
    const { subscribers } = await getSubscribers();

    return (
        <div className="p-8">
            <SubscriberManager subscribers={subscribers} />
        </div>
    );
}
