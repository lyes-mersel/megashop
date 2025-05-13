"use client";

import { useState } from "react";
import OrderHeader from "@/components/store/orderpage/OrderHeader";
import DeliveryAddressForm from "@/components/store/orderpage/DeliveryAddressForm";
import PaymentInfoForm from "@/components/store/orderpage/PaymentInfoForm";
import OrderSummary from "@/components/store/orderpage/OrderSummary";

export default function OrderPage() {
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    wilaya: "",
    postalCode: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cvc: "",
    cardholderName: "",
    expirationDate: "",
  });

  const handleDeliveryAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeliveryAddress({ ...deliveryAddress, [e.target.name]: e.target.value });
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // TODO: Implement order submission logic with API calls
    console.log("Order submitted:", { deliveryAddress, paymentInfo });
  };

  return (
    <main className="min-h-[calc(100dvh-125px)] py-10 bg-white">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <OrderHeader />
        <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 items-start">
          <div className="w-full flex flex-col space-y-5">
            <DeliveryAddressForm
              deliveryAddress={deliveryAddress}
              onChange={handleDeliveryAddressChange}
            />
            <PaymentInfoForm
              paymentInfo={paymentInfo}
              onChange={handlePaymentInfoChange}
            />
          </div>
          <OrderSummary onSubmit={handleSubmit} />
        </div>
      </div>
    </main>
  );
}
