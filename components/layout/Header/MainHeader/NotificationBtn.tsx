import Image from "next/image";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";

const NotificationBtn = () => {
  return (
    <Link href="/notifications" passHref>
      <Button variant="ghost" className="p-1 md:p-2">
        <Image
          priority
          src="/icons/notification.svg"
          height={22}
          width={22}
          alt="user"
          className="cursor-pointer max-w-[19px] max-h-[19px] md:max-w-[22px] md:max-h-[22px]"
        />
      </Button>
    </Link>
  );
};

export default NotificationBtn;
