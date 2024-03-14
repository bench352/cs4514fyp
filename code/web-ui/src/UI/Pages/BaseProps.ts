export interface BasePageProps {
    setShowLoading: (visibility: boolean) => void;
    createSnackBar: (message: string) => void;
}

export interface AddAssetDialogProps extends BasePageProps {
    open: boolean;
    setShowDialog: (visibility: boolean) => void;
}

export interface AssetDialogProps extends BasePageProps {
    open: boolean;
    assetId?: string;
}