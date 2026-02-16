import { toast } from "sonner"

export const useToast = () => {
    return {
        toast: (props: any) => {
            toast(props.title, {
                description: props.description,
                action: props.action,
            })
        }
    }
}
