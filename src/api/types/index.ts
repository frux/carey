export type Migration = MigrationItem[];

export type MigrationItem = ActionGroup | Action;

export interface ActionGroup {
	with: string;
	do: Action[];
}

export type Action<Payload = any> = {
	_handler: (...args: any[]) => Promise<void>;
	type: (...args: any[]) => Action<Payload>;
	payload: Payload;
};

export type ActionContext = string;
