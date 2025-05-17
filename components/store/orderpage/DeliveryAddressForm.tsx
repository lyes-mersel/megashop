import InputGroup from "@/components/ui/input-group";
import { satoshi } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface DeliveryAddressFormProps {
  deliveryAddress: {
    street: string;
    city: string;
    wilaya: string;
    postalCode: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

export default function DeliveryAddressForm({
  deliveryAddress,
  onChange,
  errors,
}: DeliveryAddressFormProps) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-black/10 shadow-md bg-white">
      <h3
        className={cn(
          satoshi.className,
          "text-xl md:text-2xl font-bold text-black mb-6 flex items-center gap-3"
        )}
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
          <MapPin className="h-5 w-5 text-gray-700" />
        </div>
        Adresse de livraison
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <InputGroup className="focus-within:shadow-none">
            <InputGroup.Text
              className={cn(satoshi.className, "text-gray-700 font-medium")}
            >
              Rue
            </InputGroup.Text>
            <InputGroup.Input
              type="text"
              name="street"
              value={deliveryAddress.street}
              onChange={onChange}
              placeholder="Entrez votre rue"
              className={cn(
                satoshi.className,
                "text-black placeholder:text-gray-400 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none transition-all duration-200",
                errors["addresse.rue"] && "border-red-500"
              )}
              required
            />
          </InputGroup>
          {errors["addresse.rue"] && (
            <p className="text-red-500 text-sm float-right">
              {errors["addresse.rue"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <InputGroup className="focus-within:shadow-none">
            <InputGroup.Text
              className={cn(satoshi.className, "text-gray-700 font-medium")}
            >
              Ville
            </InputGroup.Text>
            <InputGroup.Input
              type="text"
              name="city"
              value={deliveryAddress.city}
              onChange={onChange}
              placeholder="Entrez votre ville"
              className={cn(
                satoshi.className,
                "text-black placeholder:text-gray-400 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none transition-all duration-200",
                errors["addresse.ville"] && "border-red-500"
              )}
              required
            />
          </InputGroup>
          {errors["addresse.ville"] && (
            <p className="text-red-500 text-sm float-right">
              {errors["addresse.ville"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <InputGroup className="focus-within:shadow-none">
            <InputGroup.Text
              className={cn(satoshi.className, "text-gray-700 font-medium")}
            >
              Wilaya
            </InputGroup.Text>
            <InputGroup.Input
              type="text"
              name="wilaya"
              value={deliveryAddress.wilaya}
              onChange={onChange}
              placeholder="Entrez votre wilaya"
              className={cn(
                satoshi.className,
                "text-black placeholder:text-gray-400 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none transition-all duration-200",
                errors["addresse.wilaya"] && "border-red-500"
              )}
              required
            />
          </InputGroup>
          {errors["addresse.wilaya"] && (
            <p className="text-red-500 text-sm float-right">
              {errors["addresse.wilaya"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <InputGroup className="focus-within:shadow-none">
            <InputGroup.Text
              className={cn(satoshi.className, "text-gray-700 font-medium")}
            >
              Code postal
            </InputGroup.Text>
            <InputGroup.Input
              type="text"
              name="postalCode"
              value={deliveryAddress.postalCode}
              onChange={onChange}
              placeholder="Entrez votre code postal"
              className={cn(
                satoshi.className,
                "text-black placeholder:text-gray-400 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none transition-all duration-200",
                errors["addresse.codePostal"] && "border-red-500"
              )}
              required
            />
          </InputGroup>
          {errors["addresse.codePostal"] && (
            <p className="text-red-500 text-sm float-right">
              {errors["addresse.codePostal"]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
