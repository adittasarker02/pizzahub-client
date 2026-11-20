export const CATEGORIES = [
  { slug: 'classic', name: 'Classic Pizzas', blurb: 'Timeless favourites', emoji: '🍕', img: '/art/margherita.svg' },
  { slug: 'vegetarian', name: 'Vegetarian Pizzas', blurb: 'Fresh & garden-loaded', emoji: '🥬', img: '/art/garden.svg' },
  { slug: 'meat-lovers', name: 'Meat Lovers', blurb: 'Loaded & smoky', emoji: '🥓', img: '/art/meatlovers.svg' },
  { slug: 'specialty', name: 'Specialty / Gourmet Pizzas', blurb: "Chef's creations", emoji: '✨', img: '/art/burrata.svg' },
  { slug: 'sides', name: 'Sides & Appetizers', blurb: 'Perfect for sharing', emoji: '🧄', img: '/art/garlicbread.svg' },
  { slug: 'beverages-desserts', name: 'Beverages & Desserts', blurb: 'Sip & sweeten', emoji: '🍋', img: '/art/lavacake.svg' },
];

export const categoryName = (slug) => CATEGORIES.find((c) => c.slug === slug)?.name || slug;

export const ORDER_STATUSES = ['pending', 'accepted', 'rejected', 'cancelled'];
export const ITEM_STATUSES = ['pending', 'approved', 'rejected', 'inactive'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured first' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

export const roleHome = (role) =>
  ({ admin: '/dashboard/admin', vendor: '/dashboard/vendor', customer: '/dashboard/customer' })[role] || '/dashboard/customer';
