import { Link } from 'react-router-dom';

export const CampaignCard = ({ campaign }) => {
  const percent = Math.min(
    100,
    Math.round((campaign.amountRaised / campaign.fundingGoal) * 100) || 0
  );
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24))
  );

  return (
    <Link
      to={`/campaigns/${campaign._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 w-fit rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
          {campaign.category}
        </span>
        <h3 className="line-clamp-2 font-semibold text-gray-800">{campaign.title}</h3>
        <p className="mt-1 text-sm text-gray-500">by {campaign.creatorName}</p>

        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-800">
              {campaign.amountRaised} <span className="font-normal text-gray-400">credits raised</span>
            </span>
            <span className="text-gray-400">{daysLeft}d left</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
