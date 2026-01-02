"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast"; // ✅ import toast

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // SIMPLE LOGIN
    if (username && password) {
      router.push("/pos");
      toast.success("Login successful!");
    } else {
      toast.error("Please enter username and password"); // ✅ replace alert
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* LEFT SIDE */}
      <div className="w-1/2 bg-blue-600 text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4">POS DESKTOP</h1>
        <p className="text-lg text-center max-w-sm">
          A fast, secure and fully offline Point of Sale system for your retail business.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex justify-center items-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white p-8 shadow-lg rounded"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Login
          </h2>

          <div className="mb-4">
            <label className="block mb-1 text-sm">Username</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}





// 2-1-2026
// "use client";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // SIMPLE LOGIN (for now)
//     if (username && password) {
//       router.push("/pos");
//     } else {
//       alert("Please enter username and password");
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
      
//       {/* LEFT SIDE */}
//       <div className="w-1/2 bg-blue-600 text-white flex flex-col justify-center items-center p-10">
//         <h1 className="text-4xl font-bold mb-4">POS DESKTOP</h1>
//         <p className="text-lg text-center max-w-sm">
//           A fast, secure and fully offline Point of Sale system for your retail business.
//         </p>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="w-1/2 flex justify-center items-center">
//         <form
//           onSubmit={handleLogin}
//           className="w-full max-w-sm bg-white p-8 shadow-lg rounded"
//         >
//           <h2 className="text-2xl font-bold mb-6 text-center">
//             Login
//           </h2>

//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Username</label>
//             <input
//               type="text"
//               className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block mb-1 text-sm">Password</label>
//             <input
//               type="password"
//               className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//           >
//             Login
//           </button>
//         </form>
//       </div>

//     </div>
//   );
// }
