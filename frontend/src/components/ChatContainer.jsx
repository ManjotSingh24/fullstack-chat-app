import React from "react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser,subscribeToMessages,unsubscribeFromMessages } =
    useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = React.useRef(null);//this is used to scroll to the bottom of the chat when new messages arrive

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages(); // Subscribe to new messages when the component mounts


    return () => {
      unsubscribeFromMessages(); // Unsubscribe when the component unmounts
      // This prevents memory leaks and ensures that we don't receive messages for a user that is no longer selected
    };
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && messages) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  },[messages])

  //loading state jab tak messages nhi load hory
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />{" "}
        {/* ye main hai baku header and neechy input to same hai*/}
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      {/* Messages will be displayed here */}
      <div className="flex-1 flex flex-col overflow_auto">

        {messages.map((message) => (
          
          
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start" // senderId is authUser._id means this message is sent by the user show it in chat-end
            }` }
             ref={messagesEndRef}
          >

            <div className="chat-image avatar">
              <div className="size-10 rounded-full border ">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "avatar.png"
                  } //dynamic rkhangy chat naal prfile ayegi agar profile hai nhi tan avatar use krlo
                  alt="profile pic"
                />
              </div>
            </div>


            {/* flex-coo ohp dev dy elmenst nu vertical ch kardenda like oimage and text */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}{" "}
              </time>
            </div>


            <div className="chat-bubble flex flex-col">  
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className="sm:max-w-[200px] rounded-mb mb-2"
                />
              )}
              {message.text &&<p>{message.text} </p>}
            </div>

            
            
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
