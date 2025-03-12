import { motion } from "framer-motion";

const FieldErrorMessage = ({ message }: { message: string }) => {
  if (!message || message === "") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="text-red-500 text-sm"
    >
      {message}
    </motion.div>
  );
};

export default FieldErrorMessage;
