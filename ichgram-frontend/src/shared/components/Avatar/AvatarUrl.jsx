

 const getAvatarUrl = (avatar) => {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith("http") || avatar.startsWith("data:")) return avatar;

  return `http://localhost:3000${avatar}`.replace(/([^:]\/)\/+/g, "$1");
};

export default getAvatarUrl 


