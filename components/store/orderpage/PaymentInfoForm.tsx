import InputGroup from "@/components/ui/input-group";
import { satoshi } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";

interface PaymentInfoFormProps {
  paymentInfo: {
    cardNumber: string;
    cvc: string;
    cardholderName: string;
    expirationDate: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

export default function PaymentInfoForm({
  paymentInfo,
  onChange,
  errors,
}: PaymentInfoFormProps) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-black/10 shadow-md bg-white">
      <h3
        className={cn(
          satoshi.className,
          "text-xl md:text-2xl font-bold text-black mb-6 flex items-center gap-3"
        )}
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
          <CreditCard className="h-5 w-5 text-gray-700" />
        </div>
        Informations de paiement
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2 space-y-2">
          <InputGroup className="focus-within:shadow-none">
            <InputGroup.Text
              className={cn(satoshi.className, "text-gray-700 font-medium")}
            >
              Numéro de carte
            </InputGroup.Text>
            <InputGroup.Input
              type="text"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={onChange}
              placeholder="Entrez votre numéro de carte"
              className={cn(
                satoshi.className,
                "text-black placeholder:text-gray-400 px-4 py-3 border border-gray-200 rounded-lg transition-all duration-200",
                errors["payment.cardNumber"] && "border-red-500"
              )}
              required
            />
          </InputGroup>
          {errors["payment.cardNumber"] && (
            <p className="text-red-500 text-sm float-right">
              {errors["payment.cardNumber"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <InputGroup className="focus-within:shadow-none">
            <InputGroup.Text
              className={cn(satoshi.className, "text-gray-700 font-medium")}
            >
              CVC
            </InputGroup.Text>
            <InputGroup.Input
              type="text"
              name="cvc"
              value={paymentInfo.cvc}
              onChange={onChange}
              placeholder="Entrez votre CVC"
              className={cn(
                satoshi.className,
                "text-black placeholder:text-gray-400 px-4 py-3 border border-gray-200 rounded-lg transition-all duration-200",
                errors["payment.cvc"] && "border-red-500"
              )}
              required
            />
          </InputGroup>
          {errors["payment.cvc"] && (
            <p className="text-red-500 text-sm float-right">
              {errors["payment.cvc"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <InputGroup className="focus-within:shadow-none">
            <InputGroup.Text
              className={cn(satoshi.className, "text-gray-700 font-medium")}
            >
              Date d&apos;expiration
            </InputGroup.Text>
            <InputGroup.Input
              type="text"
              name="expirationDate"
              value={paymentInfo.expirationDate}
              onChange={onChange}
              placeholder="MM/AA"
              className={cn(
                satoshi.className,
                "text-black placeholder:text-gray-400 px-4 py-3 border border-gray-200 rounded-lg transition-all duration-200",
                errors["payment.expirationDate"] && "border-red-500"
              )}
              required
            />
          </InputGroup>
          {errors["payment.expirationDate"] && (
            <p className="text-red-500 text-sm float-right">
              {errors["payment.expirationDate"]}
            </p>
          )}
        </div>
        
        <div className="sm:col-span-2 space-y-2">
          <InputGroup className="focus-within:shadow-none">
            <InputGroup.Text
              className={cn(satoshi.className, "text-gray-700 font-medium")}
            >
              Nom du titulaire
            </InputGroup.Text>
            <InputGroup.Input
              type="text"
              name="cardholderName"
              value={paymentInfo.cardholderName}
              onChange={onChange}
              placeholder="Entrez le nom du titulaire"
              className={cn(
                satoshi.className,
                "text-black placeholder:text-gray-400 px-4 py-3 border border-gray-200 rounded-lg transition-all duration-200",
                errors["payment.legalName"] && "border-red-500"
              )}
              required
            />
          </InputGroup>
          {errors["payment.legalName"] && (
            <p className="text-red-500 text-sm float-right">
              {errors["payment.legalName"]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
