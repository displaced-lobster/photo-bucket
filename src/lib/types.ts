export interface Row {
	folder: string;
	photos: string[];
}

export interface RowListResponse {
	rows: Row[];
	photosBaseUrl: string;
}
