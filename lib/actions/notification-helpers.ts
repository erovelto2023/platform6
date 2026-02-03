"use server";

import { createNotification } from "./notification.actions";

export async function notifyLike(postAuthorId: string, likerId: string, postId: string) {
    if (postAuthorId === likerId) return; // Don't notify yourself

    await createNotification({
        recipientId: postAuthorId,
        senderId: likerId,
        type: "like",
        content: "liked your post",
        link: `/community/posts/${postId}`
    });
}

export async function notifyComment(postAuthorId: string, commenterId: string, postId: string) {
    if (postAuthorId === commenterId) return;

    await createNotification({
        recipientId: postAuthorId,
        senderId: commenterId,
        type: "comment",
        content: "commented on your post",
        link: `/community/posts/${postId}`
    });
}

export async function notifyReply(commentAuthorId: string, replierId: string, postId: string) {
    if (commentAuthorId === replierId) return;

    await createNotification({
        recipientId: commentAuthorId,
        senderId: replierId,
        type: "reply",
        content: "replied to your comment",
        link: `/community/posts/${postId}`
    });
}

export async function notifyMention(mentionedUserId: string, mentionerId: string, postId: string) {
    if (mentionedUserId === mentionerId) return;

    await createNotification({
        recipientId: mentionedUserId,
        senderId: mentionerId,
        type: "mention",
        content: "mentioned you in a post",
        link: `/community/posts/${postId}`
    });
}

export async function notifyShare(postAuthorId: string, sharerId: string, postId: string) {
    if (postAuthorId === sharerId) return;

    await createNotification({
        recipientId: postAuthorId,
        senderId: sharerId,
        type: "post_share",
        content: "shared your post",
        link: `/community/posts/${postId}`
    });
}

export async function notifyFriendRequest(recipientId: string, senderId: string) {
    await createNotification({
        recipientId,
        senderId,
        type: "friend_request",
        content: "sent you a friend request",
        link: `/community/friends/requests`
    });
}

export async function notifyFriendAccepted(recipientId: string, senderId: string) {
    await createNotification({
        recipientId,
        senderId,
        type: "friend_accepted",
        content: "accepted your friend request",
        link: `/community/friends`
    });
}

export async function notifyGroupInvite(recipientId: string, senderId: string, groupId: string, groupName: string) {
    await createNotification({
        recipientId,
        senderId,
        type: "group_invite",
        content: `invited you to join ${groupName}`,
        link: `/community/groups/${groupId}`,
        relatedId: groupId
    });
}

export async function notifyEventInvite(recipientId: string, senderId: string, eventId: string, eventName: string) {
    await createNotification({
        recipientId,
        senderId,
        type: "event_invite",
        content: `invited you to ${eventName}`,
        link: `/community/events/${eventId}`,
        relatedId: eventId
    });
}
