import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";

const descriptionData = `
## ✨ Caractéristiques principales  

- ✅ **Qualité supérieure** : Conçu avec des matériaux haut de gamme pour un confort durable.  
- 🚀 **Livraison rapide** : Recevez votre commande en un temps record.  
- 🌟 **Garantie 2 ans** : Achetez en toute sérénité avec notre garantie étendue.  

### 📦 Instructions d’utilisation  

1. **Déballez** soigneusement votre article.  
2. **Suivez** les recommandations d’entretien pour préserver sa qualité.  
3. **Portez-le** avec style et profitez d’un confort incomparable ! 🎉  

---

Envie d’ajouter une touche d’élégance à votre garde-robe ? Ce vêtement est fait pour vous !
`;

const ProductDescription = ({ productId }: { productId: string }) => {
  useEffect(() => {
    // Fetch product description data
  }, [productId]);
  return (
    <section>
      <h3 className="text-xl sm:text-2xl font-bold text-black mb-5 sm:mb-6">
        Product description
      </h3>
      <div className="prose prose-lg">
        <ReactMarkdown>{descriptionData}</ReactMarkdown>
      </div>
    </section>
  );
};

export default ProductDescription;
