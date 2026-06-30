export interface Row {
	photos: string[];
}

export interface Album {
	folder: string;
	title: string;
	rows: Row[];
}

export interface AlbumListResponse {
	albums: Album[];
	photosBaseUrl: string;
}
