import { lazy, Suspense, useMemo, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightning, Square, Gift, Handshake, Crown, Television, Truck, Microphone, Palette } from '../../components/icons';
import { CartSection } from './components/CartSection';
import BackButton from '../../components/common/BackButton';
import HeaderTitle from '../../components/common/HeaderTitle';
import { CurrencySymbol } from '../../components/common/CurrencySymbol';
import ItemRow, { type ItemRowProperties } from './components/CartItemRow';
import ActionButton from '../../components/common/ActionButton';
import type { CartIconKey } from '../../stores/studioShowCartStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { useStudioShowCart } from '../../hooks/studioShow/useStudioShowCart';
import { useCartCrossSelling } from '../../hooks/studioShow/useCartCrossSelling';
import CircularLoader from '../../components/common/CircularLoader';
import { BlanketOrderAttachment } from '../../components/common/BlanketOrderAttachment';

const ICON_MAP: Record<CartIconKey, () => ReactElement> = {
    square: () => <Square />,
    lightning: () => <Lightning />,
    crown: () => <Crown />,
    handshake: () => <Handshake />,
    television: () => <Television />,
    truck: () => <Truck />,
    microphone: () => <Microphone />,
    palette: () => <Palette />,
    default: () => <Gift />,
};

const QuoteRequestModal = lazy(() => import('../sponsorshipType/studioShow/declareRewards/components/QuoteRequestModal'));
function CartPage() {
    const navigate = useNavigate();
    const {
        open,
        setOpen,
        isRequestingQuote,
        requestQuoteError,
        hasSelectedItems,
        episodes,
        selectedItemsCount,
        formattedTotals,
        rawTotalWithVat,
        selectedBlanketOrderId,
        setSelectedBlanketOrderId,
        removeItem,
        clearEpisode,
        toggleItemSelection,
        toggleEpisodeSelection,
        isItemSelected,
        isEpisodeFullySelected,
        handleRequestQuote,
        addItem,
        isItemInCart,
        vatMutation,
    } = useStudioShowCart();

    // Fetch cross-selling data based on cart episodes
    const { crossSellingItems, isLoadingCrossSelling } = useCartCrossSelling(episodes, {
        navigate,
        addItem,
        isItemInCart,
    });

    const episodesLength = episodes.length;
    const totalWithVat = Number(formattedTotals?.totalWithVat.replaceAll(',', ''));
    const isLoading = vatMutation.isPending || isRequestingQuote;
    let loaderLabel = '';

    if (vatMutation.isPending) {
        loaderLabel = 'Calculating VAT…';
    } else if (isRequestingQuote) {
        loaderLabel = 'Submitting Quote…';
    }

    // Handle back button click - navigate to latest episode's categories page
    const handleBackClick = () => {
        // Get the last visited episode from sessionStorage
        const lastVisitedEpisode = sessionStorage.getItem('lastVisitedEpisode');
        if (lastVisitedEpisode) {
            // If we have a last visited episode and it exists in the cart, navigate to it
            const encodedEpisodeName = encodeURIComponent(lastVisitedEpisode);
            navigate(`/sponsorship-type/studio-show/${encodedEpisodeName}/categories`);
        } else {
            navigate(-1);
        }
    };

    const resolvedEpisodes = useMemo(() => {
        return episodes.map(episode => {
            // Calculate total only for selected items in this episode
            const selectedItems = episode.items.filter(item => isItemSelected(item.id));
            // Calculate total for selected items whose showSelectSquareBtn is false
            const total = formatCurrency(selectedItems.filter(item => !item.showSelectSquareBtn).reduce((sum, item) => sum + item.price, 0));

            const items = episode.items.map<ItemRowProperties>(item => ({
                id: item.id,
                variant: 'cart',
                icon: ICON_MAP[item.iconKey]?.() ?? ICON_MAP.default(),
                iconBgColor: item.iconBgColor,
                name: item.title,
                price: formatCurrency(item.price),
                usp: item.usp ? formatCurrency(item.usp) : undefined,
                rv: item.rv ? formatCurrency(item.rv) : undefined,
                showSelectSquareBtn: item.showSelectSquareBtn,
                isChecked: isItemSelected(item.id),
                onToggleSelection: toggleItemSelection,
            }));

            return {
                episodeName: episode.episodeName,
                episodeTitle: episode.items[0]?.episodeTitle || episode.episodeName,
                items,
                total,
                isFullySelected: isEpisodeFullySelected(episode.episodeName),
            };
        });
    }, [episodes, isItemSelected, toggleItemSelection, isEpisodeFullySelected, selectedItemsCount]);

    return (
        <div className="flex flex-col gap-6 relative">
            {isLoading && (
                <div className="fixed inset-0 bg-gray-400/70  flex items-center justify-center z-50">
                    <CircularLoader label={loaderLabel} size={50} />
                </div>
            )}
            <BackButton onClick={handleBackClick} />

            <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
                <div className="rounded-lg border border-border-gray-600 h-fit lg:col-span-5 p-4">
                    <HeaderTitle text="Cart" size="2xl" color="text-primary-text" weight="medium" className="mb-6" />
                    {episodesLength === 0 ? (
                        <div className="flex items-center justify-center py-12 text-sm text-secondary-text">Your cart is empty.</div>
                    ) : (
                        resolvedEpisodes.map((episode, index) => (
                            <CartSection
                                key={episode.episodeName}
                                title={episode.episodeTitle}
                                episodeNameForLink={episode.episodeName}
                                items={episode.items}
                                total={episode.total}
                                showTotal={episode.items.length > 0}
                                onClearAll={() => clearEpisode(episode.episodeName)}
                                onDeleteItem={itemId => removeItem(episode.episodeName, itemId)}
                                isEpisodeFullySelected={episode.isFullySelected}
                                onToggleEpisodeSelection={selectAll => toggleEpisodeSelection(episode.episodeName, selectAll)}
                                className={
                                    episodesLength > index && index !== episodesLength - 1
                                        ? `${index > 0 ? 'py-6' : 'pb-6'} border-b border-border-gray`
                                        : 'border-b-0 pt-6'
                                }
                            />
                        ))
                    )}
                </div>

                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="rounded-lg border border-border-gray-600 flex flex-col gap-6 p-4">
                        {hasSelectedItems ? (
                            <>
                                <div className="flex flex-col gap-6">
                                    <HeaderTitle text={formattedTotals.cartTotalLabel} color="text-tertiary-text" size="xl" weight="medium" />
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-sm">
                                            <HeaderTitle text="Subtotal (Reward Value)" size="md" color="text-primary-text" weight="normal" />
                                            <div className="flex gap-1">
                                                <CurrencySymbol className="text-primary-text text-base font-normal" />
                                                <HeaderTitle text={formattedTotals.subtotalRV} size="md" color="text-primary-text" weight="normal" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <HeaderTitle text="Subtotal (USPs)" size="md" color="text-primary-text" weight="normal" />
                                            <div className="flex gap-1">
                                                <CurrencySymbol className="text-primary-text text-base font-normal" />
                                                <HeaderTitle text={formattedTotals.subtotalUSP} size="md" color="text-primary-text" weight="normal" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <HeaderTitle text="VAT" size="md" color="text-primary-text" weight="normal" />
                                            <div className="flex gap-1">
                                                <CurrencySymbol className="text-primary-text text-base font-normal" />
                                                <HeaderTitle
                                                    text={formattedTotals.formattedVat}
                                                    size="md"
                                                    color="text-primary-text"
                                                    weight="normal"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <HeaderTitle text="Total" size="2xl" color="text-primary-text" weight="medium" />
                                        <div className="flex gap-1">
                                            <CurrencySymbol className="text-primary-text text-2xl font-medium" />
                                            <HeaderTitle text={formattedTotals.totalWithVat} size="2xl" color="text-primary-text" weight="medium" />
                                        </div>
                                    </div>
                                </div>

                                <BlanketOrderAttachment
                                    totalBudget={rawTotalWithVat}
                                    selectedBlanketOrderId={selectedBlanketOrderId}
                                    onChange={setSelectedBlanketOrderId}
                                />

                                <div className="flex flex-col gap-2">
                                    {requestQuoteError ? <p className="text-sm text-red-600">{requestQuoteError}</p> : undefined}

                                    <ActionButton
                                        textColor="text-white"
                                        width="full"
                                        borderRadius="rounded-sm"
                                        bgColor="bg-brand-primary-500"
                                        className="p-2 gap-2 font-ubuntu"
                                        onClick={handleRequestQuote}
                                        isDisabled={!hasSelectedItems || !totalWithVat || isRequestingQuote}
                                    >
                                        {isRequestingQuote ? 'Submitting…' : 'Request Quote'}
                                    </ActionButton>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-6">
                                    <div className="rounded-md border border-border-gray-600 bg-gray-50 p-4 text-center">
                                        <HeaderTitle text="No Item Selected" color="text-secondary-text" size="md" weight="normal" />
                                    </div>
                                </div>

                                <ActionButton
                                    textColor="text-white"
                                    width="full"
                                    borderRadius="rounded-sm"
                                    bgColor="bg-brand-primary-500"
                                    className="p-2 gap-2 font-ubuntu opacity-50 cursor-not-allowed"
                                    onClick={() => {}}
                                    isDisabled
                                >
                                    Request Quote
                                </ActionButton>
                            </>
                        )}
                    </div>
                    {/* cross selling items */}
                    {isLoadingCrossSelling ? (
                        <div className="text-sm text-secondary-text text-center py-4">Loading recommendations...</div>
                    ) : (
                        crossSellingItems.length > 0 && (
                            <div className="bg-white rounded-lg border border-border-gray-600 p-4 flex flex-col gap-6">
                                <HeaderTitle text="Recommended Add-ons for better visibility" size="md" color="text-primary-text" weight="medium" />
                                <div className="flex flex-col gap-2 max-h-96 pr-2 overflow-y-auto">
                                    {crossSellingItems.map(item => (
                                        <ItemRow key={item.id} {...item} className="px-0!" />
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            <Suspense fallback={undefined}>
                <QuoteRequestModal visible={open} onHide={() => setOpen(false)} />
            </Suspense>
        </div>
    );
}

export default CartPage;
