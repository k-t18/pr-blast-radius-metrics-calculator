interface SaveButtonProperties {
    disabled: boolean;
    onClick: () => void;
}

function SaveButton({ disabled, onClick }: SaveButtonProperties) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`w-fit font-ubuntu p-2 text-sm leading-5 rounded ${
                disabled ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-brand-500 text-white hover:bg-brand-600'
            }`}
        >
            Save & Continue
        </button>
    );
}

export default SaveButton;
