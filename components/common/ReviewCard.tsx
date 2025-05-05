import React from "react";

// UI Components
import Rating from "@/components/ui/Rating";
import { Button } from "@/components/ui/button";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoEllipsisHorizontal } from "react-icons/io5";

// Utils & Types
import { cn, extractDateString } from "@/lib/utils";
import { ReviewFromAPI } from "@/lib/types/review.types";

type ReviewCardProps = {
  blurChild?: React.ReactNode;
  isAction?: boolean;
  isDate?: boolean;
  review: ReviewFromAPI;
  className?: string;
};

const ReviewCard = ({
  blurChild,
  isAction = false,
  isDate = false,
  review,
  className,
}: ReviewCardProps) => {
  return (
    <div
      className={cn([
        "relative bg-white flex flex-col items-start aspect-auto border border-black/10 rounded-[20px] p-6 sm:px-8 sm:py-7 overflow-hidden",
        className,
      ])}
    >
      {blurChild && blurChild}
      <div className="w-full flex items-center justify-between mb-3 sm:mb-4">
        <Rating
          initialValue={review.note}
          allowFraction
          SVGclassName="inline-block"
          size={23}
          readonly
        />
        {isAction && (
          <Button variant="ghost" size="icon">
            <IoEllipsisHorizontal className="text-black/40 text-2xl" />
          </Button>
        )}
      </div>
      <div className="flex items-center mb-2 sm:mb-3">
        <strong className="text-black sm:text-xl mr-1">
          {review.user.prenom} {review.user.nom}
        </strong>
        <IoIosCheckmarkCircle className="text-[#01AB31] text-xl sm:text-2xl" />
      </div>
      <p className="text-sm sm:text-base text-black/60">{review.text}</p>
      {isDate && (
        <p className="text-black/60 text-sm font-medium mt-4 sm:mt-6">
          Posted on {extractDateString(review.date)}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
