/**
 * Left-side based Connector enum/string.
 */
export enum RelationshipConnector {
	ONE = '||',
	ZERO_OR_ONE = '|o',
	ZERO_OR_MORE = '}o',
	ONE_OR_MORE = '}|',
}

export interface Relationship {
	leftEntity: string;
	leftConnector: RelationshipConnector;
	rightConnector: RelationshipConnector;
	rightEntity: string;
}
