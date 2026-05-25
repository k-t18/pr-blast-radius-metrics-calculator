import InputField from '../../../../../components/form-fields/inputField/InputField';

interface VoucherExtraFieldsProperties {
    itemId: string;
    startDate: string;
    durationMonths: number;
    onStartDateChange: (value: string) => void;
    onDurationChange: (value: number) => void;
}

function VoucherExtraFields({ itemId, startDate, durationMonths, onStartDateChange, onDurationChange }: VoucherExtraFieldsProperties) {
    return (
        <div className="grid grid-cols-6 gap-4">
            <div className="flex flex-col gap-3">
                <div className="text-sm font-medium text-charcoal">
                    Start date<span className="text-red-600">*</span>
                </div>
                <label htmlFor={`startDate-${itemId}`}>
                    <input
                        type="date"
                        id={`startDate-${itemId}`}
                        name={`startDate-${itemId}`}
                        aria-label="Start date"
                        value={startDate}
                        onChange={event => onStartDateChange(event.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md leading-5 text-xs font-normal"
                    />
                </label>
            </div>
            <InputField
                id={`duration-${itemId}`}
                name={`duration-${itemId}`}
                type="number"
                label="Duration (months)"
                value={durationMonths}
                onChange={v => onDurationChange(Number(v) || 0)}
                inputClassName="max-w-[173px]"
                required
            />
        </div>
    );
}

export default VoucherExtraFields;
