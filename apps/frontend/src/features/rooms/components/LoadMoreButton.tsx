type Props = {
    loading: boolean;
    hasNext: boolean;
    onClick: () => void;
};

export default function LoadMoreButton({
    loading,
    hasNext,
    onClick,
}: Props) {
    if (!hasNext) return null;

    return (
        <div className="flex justify-center mt-8">
            <button
                onClick={onClick}
                disabled={loading}
                className="btn-outline"
            >
                {loading ? "Loading..." : "Load more rooms"}
            </button>
        </div>
    );
}
