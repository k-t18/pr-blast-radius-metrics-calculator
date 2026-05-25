import InputField from '../../../../../components/form-fields/inputField/InputField';

interface DescriptionFieldProperties {
    itemId: string;
    value: string;
    onChange: (value: string) => void;
}

function DescriptionField({ itemId, value, onChange }: DescriptionFieldProperties) {
    return (
        <InputField
            id={`desc-${itemId}`}
            name={`desc-${itemId}`}
            label="Description"
            value={value}
            onChange={onChange}
            placeholder="iPhone 15"
            required
            className="max-w-[520px]"
        />
    );
}

export default DescriptionField;
