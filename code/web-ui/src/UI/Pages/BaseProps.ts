export interface BasePageProps {
  setShowLoading: (visibility: boolean) => void;
  createErrorSnackBar: (message: string) => void;
}

export interface AddAssetDialogProps extends BasePageProps {
  open: boolean;
  setShowDialog: (visibility: boolean) => void;
}

export interface AssetDialogProps extends BasePageProps {
  open: boolean;
  entityId?: string;
}
