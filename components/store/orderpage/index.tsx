"use client";

import { useState, useEffect } from "react";
import OrderHeader from "@/components/store/orderpage/OrderHeader";
import DeliveryAddressForm from "@/components/store/orderpage/DeliveryAddressForm";
import PaymentInfoForm from "@/components/store/orderpage/PaymentInfoForm";
import OrderSummary from "@/components/store/orderpage/OrderSummary";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { PrepareOrderFromAPI } from "@/lib/types/order.types";
import { ApiResponse } from "@/lib/types/apiResponse.types";
import IsLoading from "@/components/store/cartpage/IsLoading";
import IsOrderSuccessful from "@/components/store/orderpage/IsOrderSuccessful";

export default function OrderPageMain() {
  const { data: session } = useSession();
  const cart = useAppSelector((state: RootState) => state.carts.cart);

  const [orderSummary, setOrderSummary] = useState<PrepareOrderFromAPI | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isFetchingSummary, setIsFetchingSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderSuccessful, setIsOrderSuccessful] = useState(false);

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

  useEffect(() => {
    const fetchOrderSummary = async () => {
      if (!cart || cart.items.length === 0) {
        setErrorMessage(
          "Votre panier est vide. Vous devez ajouter des produits avant de passer une commande."
        );
        return;
      }

      setIsFetchingSummary(true);
      setErrorMessage(null);

      const payload = {
        produits: cart.items.map((item) => ({
          produitId: item.id,
          quantite: item.quantity,
          couleurId: item.color.id,
          tailleId: item.size.id,
        })),
      };

      try {
        const response = await fetch("/api/orders/prepare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data: ApiResponse<PrepareOrderFromAPI> = await response.json();
          setOrderSummary(data.data);
        } else if (response.status === 400) {
          const errorData: ApiResponse<PrepareOrderFromAPI> =
            await response.json();
          if (
            errorData.error ===
            "Échec de la création du produit : Un ou plusieurs IDs fournis sont invalides."
          ) {
            setErrorMessage(
              "Une erreur s'est produite lors de la préparation de la commande. Veuillez mettre à jour votre panier avec du contenu récent. Les produits fournis n'existent pas ou leurs identifiants ont changé."
            );
          } else {
            setErrorMessage(
              "Une erreur s'est produite lors de la préparation de la commande."
            );
          }
        } else {
          setErrorMessage(
            "Une erreur s'est produite lors de la préparation de la commande."
          );
        }
      } catch {
        setErrorMessage(
          "Une erreur s'est produite lors de la préparation de la commande."
        );
      } finally {
        setIsFetchingSummary(false);
      }
    };

    fetchOrderSummary();
  }, [cart]);

  const handleDeliveryAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeliveryAddress({ ...deliveryAddress, [e.target.name]: e.target.value });
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!orderSummary) return;

    setIsSubmitting(true);
    setValidationErrors({});
    setErrorMessage(null);

    const productsForOrder = orderSummary.produits.map((product) => ({
      produitId: product.produitId,
      quantite: product.quantite,
      couleurId: product.couleur?.id,
      tailleId: product.taille?.id,
    }));

    const payload = {
      userId: session!.user.id,
      addresse: {
        rue: deliveryAddress.street,
        ville: deliveryAddress.city,
        wilaya: deliveryAddress.wilaya,
        codePostal: deliveryAddress.postalCode,
      },
      payment: {
        cardNumber: paymentInfo.cardNumber,
        cvc: paymentInfo.cvc,
        expirationDate: paymentInfo.expirationDate,
        legalName: paymentInfo.cardholderName,
      },
      produits: productsForOrder,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsOrderSuccessful(true);
      } else if (response.status === 400) {
        const errorData = await response.json();
        if (errorData.data) {
          const errors = errorData.data.reduce(
            (
              acc: { [key: string]: string },
              err: { field: string; message: string }
            ) => {
              acc[err.field] = err.message;
              return acc;
            },
            {}
          );
          setValidationErrors(errors);
          setErrorMessage("Veuillez corriger les erreurs ci-dessous.");
        } else {
          setErrorMessage(
            errorData.error || "Une erreur s'est produite lors de la commande."
          );
        }
      } else {
        setErrorMessage("Une erreur s'est produite lors de la commande.");
      }
    } catch {
      setErrorMessage("Une erreur s'est produite lors de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrderSuccessful) {
    return <IsOrderSuccessful />;
  }

  return (
    <main className="min-h-[calc(100dvh-125px)] py-10 bg-white">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <OrderHeader />
        {isFetchingSummary ? (
          <IsLoading />
        ) : errorMessage && !Object.keys(validationErrors).length ? (
          <div className="text-red-500">{errorMessage}</div>
        ) : (
          <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 items-start">
            <div className="w-full flex flex-col space-y-5">
              {errorMessage && (
                <div className="text-red-500">{errorMessage}</div>
              )}
              <DeliveryAddressForm
                deliveryAddress={deliveryAddress}
                onChange={handleDeliveryAddressChange}
                errors={validationErrors}
              />
              <PaymentInfoForm
                paymentInfo={paymentInfo}
                onChange={handlePaymentInfoChange}
                errors={validationErrors}
              />
            </div>
            {orderSummary && (
              <OrderSummary
                orderSummary={orderSummary}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
