// Pagination Defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;
export const MAX_ID_LENGTH = 25;

// Cloud folder names
export const ALLOWED_FOLDERS = ["products", "avatars"];

// File Upload Limits
export const MAX_UPLOAD_SIZE_MB = 1;
export const ALLOWED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"];

// Error Messages
export const ERROR_MESSAGES = {
  // 400
  BAD_REQUEST:
    "La requête est invalide. Veuillez vérifier les données envoyées.",
  BAD_REQUEST_ID:
    "Échec de la création du produit : Un ou plusieurs IDs fournis sont invalides.",
  // 401
  UNAUTHORIZED: "Vous devez être authentifié pour accéder à cette ressource.",
  // 403
  FORBIDDEN: "Vous n'avez pas la permission d'accéder à cette ressource.",
  // 404
  NOT_FOUND: "La ressource demandée n'a pas été trouvée.",
  // 500
  INTERNAL_ERROR: "Une erreur est survenue. Veuillez réessayer plus tard.",
};
