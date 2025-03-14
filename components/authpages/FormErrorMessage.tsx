import { motion } from "framer-motion";

const FormErrorMessage = ({ message }: { message: string }) => {
  if (!message || message === "") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-red-500 text-white text-sm p-3 rounded-lg shadow-lg mt-4"
    >
      {message}
    </motion.div>
  );
};

export default FormErrorMessage;
