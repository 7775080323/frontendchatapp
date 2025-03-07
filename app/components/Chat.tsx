
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { FaPaperPlane, FaUserCircle, FaCheck, FaCheckDouble } from "react-icons/fa";

// const socket = io("http://localhost:5000");
const socket = io(process.env.NEXT_PUBLIC_API, {
  transports: ["websocket"],
  withCredentials: true,
});


interface Message {
  id: string;
  time: string;
  sender: string;
  text?: string;
  status: "sent" | "delivered" | "read";
  sentTime: string; // Ensure 'sentTime' is part of the message object
}

interface User {
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
}

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/signin");
      return;
    }

    const { name } = JSON.parse(storedUser);
    setUsername(name);
    socket.emit("join", name);

    socket.on("users", (userList: User[]) => {
      setUsers(userList);
    });

    socket.on("previousMessages", (storedMessages: Message[]) => setMessages(storedMessages));
    socket.on("receiveMessage", (messageData: Message) => {
      setMessages((prev) => [...prev, messageData]);
      socket.emit("messageDelivered", messageData.id);
    });
    socket.on("messageRead", (messageId: string) => {
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: "read" } : msg)));
    });
    socket.on("userTyping", (user: string) => {
      setTyping(user);
      setTimeout(() => setTyping(null), 3000);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("previousMessages");
      socket.off("users");
      socket.off("messageRead");
      socket.off("userTyping");
    };
  }, [router]);

  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const sendMessage = () => {
    if (message.trim() && username) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: username,
        text: message,
        time: new Date().toISOString(),
        sentTime: new Date().toISOString(), // Ensure sent time is included
        status: "sent",
      };
      console.log(newMessage); // Check if sentTime is included
    socket.emit("sendMessage", newMessage);
    setMessage(""); // Clear message input
  }
  };

  const formatMessageSentTime = (time: string) => {
    const date = new Date(time);
    if (isNaN(date.getTime())) {
      return "Invalid time"; // Return a fallback message for invalid date
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
    const handleTyping = () => {
    socket.emit("typing", username);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white shadow-lg p-4">
        <div className="flex items-center mb-4">
          <FaUserCircle className="text-4xl text-green-600" />
          <div className="ml-2">
            <h2 className="text-lg font-semibold">{username}</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Users</h3>
        <ul className="space-y-3">
          {users.map((user, index) => (
            <li
              key={index}
              className={`flex items-center p-2 rounded-lg ${user.isActive ? "bg-green-200" : "bg-gray-200"}`}
            >
              <FaUserCircle className="text-2xl text-gray-500" />
              <span className="ml-2 font-semibold">{user.name}</span>
              {user.isActive && <span className="ml-auto text-xs text-green-600">● Online</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 flex flex-col">
        <div className="bg-green-700 text-white p-4 font-semibold text-lg">Chat App</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-200">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === username ? "justify-end" : ""}`}>
              <div className={`px-4 py-2 max-w-xs rounded-lg shadow-md ${msg.sender === username ? "bg-green-500 text-white" : "bg-white text-gray-800"}`}>
                <span className="text-xs font-semibold">{msg.sender}</span>
                <p>{msg.text}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatMessageSentTime(msg.sentTime)}</span> 
                  {msg.sender === username && (msg.status === "read" ? <FaCheckDouble className="text-blue-500" /> : <FaCheck className="text-gray-500" />)}
                </div>
              </div>
            </div>
          ))}
          {typing && <p className="text-gray-500 italic">{typing} is typing...</p>}
          <div ref={chatEndRef} />
        </div>
        <div className="flex items-center p-3 bg-white shadow-md">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleTyping}
            className="flex-1 p-2 border rounded-lg outline-none"
            placeholder="Type a message..."
          />
          <FaPaperPlane className="text-green-700 cursor-pointer mx-2" onClick={sendMessage} />
        </div>
      </div>
    </div>
  );
}


// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import io from "socket.io-client";
// import { FaPaperPlane, FaUserCircle, FaCheck, FaCheckDouble } from "react-icons/fa";

// const socket = io(process.env.NEXT_PUBLIC_API, {
//   transports: ["websocket"],
//   withCredentials: true,
// });

// interface Message {
//   id: string;
//   time: string;
//   sender: string;
//   text?: string;
//   status: "sent" | "delivered" | "read";
//   sentTime: string;
// }

// interface User {
//   name: string;
//   email: string;
//   avatar?: string;
//   isActive: boolean;
// }

// export default function Chat() {
//   const router = useRouter();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [message, setMessage] = useState("");
//   const [username, setUsername] = useState<string | null>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const [typing, setTyping] = useState<string | null>(null);
//   const chatEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (!storedUser) {
//       router.replace("/auth/signin");
//       return;
//     }

//     const { name } = JSON.parse(storedUser);
//     setUsername(name);

//     socket.emit("join", name);
//     socket.on("users", (userList: string[]) => {
//       setUsers(userList.map((name) => ({ name, email: "", isActive: true })));
//     });
//     socket.on("previousMessages", (storedMessages: Message[]) => setMessages(storedMessages));
//     socket.on("receiveMessage", (messageData: Message) => {
//       setMessages((prev) => [...prev, messageData]);
//       socket.emit("messageDelivered", messageData.id);
//     });
//     socket.on("messageRead", (messageId: string) => {
//       setMessages((prev) =>
//         prev.map((msg) => (msg.id === messageId ? { ...msg, status: "read" } : msg))
//       );
//     });
//     socket.on("userTyping", (user: string) => {
//       setTyping(user);
//       setTimeout(() => setTyping(null), 3000);
//     });

//     return () => {
//       socket.off("users");
//       socket.off("receiveMessage");
//       socket.off("previousMessages");
//       socket.off("messageRead");
//       socket.off("userTyping");
//     };
//   }, [router]);

//   return null; 
// }


