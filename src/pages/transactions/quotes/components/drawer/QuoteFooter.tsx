import type { QuoteFooterProperties, QuoteItemType } from '../../../../../interfaces/quotes/quotes.types';
import { Square, Lightning, Crown } from '../../../../../components/icons';
import { CurrencySymbol } from '../../../../../components/common/CurrencySymbol';
import { CurrencyAmount } from '../../../../../components/common/CurrencyAmount';
import StatusBadge from '../../../../../components/common/StatusBadge';
import HeaderTitle from '../../../../../components/common/HeaderTitle';
import { getIconType } from '../../../../../utils/extractors';
import { sumValues } from '../../../../../utils/sumValues';

const itemIconMap: Record<QuoteItemType, React.ReactNode> = {
    square: (
        <span className="flex h-[25px] w-[25px] items-center justify-center bg-[#F9E0FF]">
            <Square size={15} color="text-black" />
        </span>
    ),
    powered: (
        <span className="flex h-[25px] w-[25px] items-center justify-center bg-[#FFEEAA]">
            <Lightning size={15} color="text-black" />
        </span>
    ),
    title: (
        <span className="flex h-[25px] w-[25px] items-center justify-center bg-[#948DFB]">
            <Crown size={15} color="text-black" />
        </span>
    ),
};

export function QuoteFooter({ quote }: QuoteFooterProperties) {
    return (
        <section className="mt-4 flex-1 space-y-6 overflow-y-auto border-t border-gray-200 pr-2 pt-4">
            {quote.episode_wise_sponsor_items && quote.episode_wise_sponsor_items.length > 0
                ? quote.episode_wise_sponsor_items.map(episode => (
                      <div key={episode.episode} className="space-y-3">
                          <HeaderTitle
                              text={`Episode ${episode.episode}`}
                              size="md"
                              weight="medium"
                              disabled={false}
                              className="text-black tracking-wide pt-2 pl-2"
                          />
                          <div className="space-y-3">
                              {episode.items.length > 0 &&
                                  episode.items.map(item => (
                                      <div key={item.name} className="flex items-center gap-4 rounded-2xl pl-2 py-1">
                                          <div>{itemIconMap[getIconType(item.sponsor_item_name)]}</div>
                                          <div className="flex flex-1 items-center justify-between">
                                              <div>
                                                  <p className="text-sm font-medium leading-[22px] text-black">{item.sponsor_item_name}</p>
                                              </div>
                                              <div className="flex items-center gap-[50px]">
                                                  <div className="text-right">
                                                      <span className="flex items-center justify-end gap-1 text-sm text-black">
                                                          <CurrencySymbol />
                                                          <CurrencyAmount value={sumValues(item?.rate, item?.custom_declared_reward_amount)} />
                                                      </span>
                                                      <span className="mt-1 text-[10px] text-secondary-text block">
                                                          USP <CurrencySymbol />
                                                          <CurrencyAmount value={item?.rate || 0} /> + RV <CurrencySymbol />
                                                          <CurrencyAmount value={item?.custom_declared_reward_amount || 0} />
                                                      </span>
                                                  </div>
                                                  {item?.custom_status && (
                                                      <StatusBadge
                                                          statusKey={item?.custom_status}
                                                          variant="filled"
                                                          shape="square"
                                                          className="text-[10px] font-normal"
                                                      />
                                                  )}
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                          </div>
                      </div>
                  ))
                : null}
        </section>
    );
}
