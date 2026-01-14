type Props = {
    loading: boolean;
    hasNext: boolean;
    onClick: () => void;
};

/**
 * Load more button component
 * Displays button to load additional pages of results
 */
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
