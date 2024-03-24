import {actionKeys} from "../config/action-keys.ts";
import {ActionKey} from "./ActionKey.tsx";

export const ActionKeysList = () => {
    return (
        <div className="flex flex-col items-center gap-3 md:col-span-7">
            <h2 className="text-2xl font-bold">Actions keys</h2>
            <div className="flex gap-2 flex-wrap items-center md:justify-normal justify-center">
                {
                    actionKeys.map(action=>(
                        <ActionKey key={action.key} action={action.action} keyToPress={action.key} />
                    ))
                }
            </div>
        </div>
    );
};
