export const CATEGORIES = [
  { slug: 'classic', name: 'Classic Pizzas', blurb: 'Timeless favourites', emoji: '🍕', img: '/food/margherita.jpg' },
  { slug: 'vegetarian', name: 'Vegetarian Pizzas', blurb: 'Fresh & garden-loaded', emoji: '🥬', img: '/food/garden.jpg' },
  { slug: 'meat-lovers', name: 'Meat Lovers', blurb: 'Loaded & smoky', emoji: '🥓', img: '/food/meatlovers.jpg' },
  { slug: 'specialty', name: 'Specialty / Gourmet Pizzas', blurb: "Chef's creations", emoji: '✨', img: '/food/burrata.jpg' },
  { slug: 'sides', name: 'Sides & Appetizers', blurb: 'Perfect for sharing', emoji: '🧄', img: '/food/garlicbread.jpg' },
  { slug: 'beverages-desserts', name: 'Beverages & Desserts', blurb: 'Sip & sweeten', emoji: '🍋', img: '/food/lavacake.jpg' },
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
