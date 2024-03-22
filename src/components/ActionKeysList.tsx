import {actionKeys} from "../config/action-keys.ts";
import {ActionKey} from "./ActionKey.tsx";

export const ActionKeysList = () => {
    return (
        <div className="flex gap-4 md:col-span-5 flex-wrap">
            {
                actionKeys.map(action=>(
                    <ActionKey key={action.key} action={action.action} keyToPress={action.key} />
                ))
            }
        </div>
    );
};
