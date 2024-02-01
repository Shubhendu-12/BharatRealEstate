import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/user/getUserInfo/${listing.userRef}`
          // Get User Info without verifying the user to show this listing to other users
        );
        const data = await res.json();
        setLandlord(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2 mt-4">
          <p className="font-semibold">
            Contact <span>{landlord.username} </span> for{" "}
            <span>{listing.name} </span>
          </p>
          <label
            htmlFor="message"
            className="block my-2  font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <textarea
            id="message"
            rows="4"
            onChange={onChange}
            value={message}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
            max-w-3xl"
            placeholder="Write your message here.."
            required
          ></textarea>

          <Link to={`mailto:${landlord.email}?subject=Regading ${listing.name}& body= ${message}`}
            type="button"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800
            uppercase text-center mt-2 max-w-3xl"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
