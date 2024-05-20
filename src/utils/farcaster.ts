export const generateShareOfferLink = (offerDay: number) => {
  const text = encodeURIComponent(
    `Looks like I just created my crypto portfolio! \nShare this post and receive rewards from the project.`,
  );

  const embeds = encodeURIComponent(`${process.env.FRAMES_AIPICK_URL}/offers/${offerDay}`);

  return `${process.env.WARPCAST_URL}/~/compose?text=${text}` + `&embeds[]=${embeds}`;
};
