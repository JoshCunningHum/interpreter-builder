import { QField, QForm, QInput } from "quasar";
import { ref, type SetupContext, type FunctionalComponent } from "vue";

interface OutputItemProps {
    text?: string;
    scan?: boolean;
    error?: boolean;
    inputted?: string;
}

type OutputItemEmits = {
    submit(text: string): void;
};

const OutputItem: FunctionalComponent<OutputItemProps, OutputItemEmits> = (
    { text = "", scan, error = false, inputted },
    context,
) => {
    const input = ref(inputted || "");

    return (
        <>
            <span class={`${error && "text-red-500"} min-h-0 w-max break-keep`}>
                {error && (
                    <span>
                        {" "}
                        <br /> ERROR:
                    </span>
                )}
                {text.split("\n").map((v, i, arr) => (
                    <span key={i}>
                        {v}
                        {i < arr.length - 2 && <br />}
                    </span>
                ))}
            </span>
            {scan !== undefined && (
                <QForm
                    onSubmit={(e) => {
                        context.emit("submit", input.value);
                    }}
                >
                    <QField
                        name="input"
                        dense
                        hideBottomSpace
                        hideHint
                    >
                        <QInput
                            hideBottomSpace
                            hideHint
                            dense
                            inputClass="p-0 text-white !min-h-0 h-5"
                            color="amber"
                            modelValue={input.value}
                            onUpdate:modelValue={(e) => {
                                input.value = String(e);
                            }}
                            disable={!scan}
                        />
                    </QField>
                </QForm>
            )}
        </>
    );
};
export default OutputItem;