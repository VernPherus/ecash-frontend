import React from "react";

const TableSkeleton = ({ rows = 5, columns = 6 }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table-modern">
                <thead>
                    <tr>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i}>
                                <div className="h-3 bg-base-300 rounded w-20 animate-pulse" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIdx) => (
                        <tr key={rowIdx}>
                            {Array.from({ length: columns }).map((_, colIdx) => (
                                <td key={colIdx}>
                                    <div
                                        className="h-4 bg-base-300 rounded animate-pulse skeleton-shimmer"
                                        style={{
                                            width: `${Math.random() * 40 + 60}%`,
                                            animationDelay: `${rowIdx * 0.1}s`,
                                        }}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const CardSkeleton = () => {
    return (
        <div className="card-static p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="h-6 bg-base-300 rounded w-16 mb-2" />
                    <div className="h-5 bg-base-300 rounded w-32" />
                </div>
                <div className="text-right">
                    <div className="h-3 bg-base-300 rounded w-16 mb-1" />
                    <div className="h-6 bg-base-300 rounded w-24" />
                </div>
            </div>
            <div className="h-2 bg-base-300 rounded w-full mb-2" />
            <div className="flex justify-between">
                <div className="h-3 bg-base-300 rounded w-20" />
                <div className="h-3 bg-base-300 rounded w-8" />
            </div>
        </div>
    );
};

const StatSkeleton = () => {
    return (
        <div className="card-static p-6 flex items-center justify-between animate-pulse">
            <div>
                <div className="h-3 bg-base-300 rounded w-24 mb-2" />
                <div className="h-8 bg-base-300 rounded w-20 mb-2" />
                <div className="h-3 bg-base-300 rounded w-32" />
            </div>
            <div className="w-12 h-12 bg-base-300 rounded-full" />
        </div>
    );
};

const FormSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="form-control">
                    <div className="h-4 bg-base-300 rounded w-24 mb-2" />
                    <div className="h-12 bg-base-300 rounded w-full" />
                </div>
            ))}
            <div className="flex gap-3 pt-4">
                <div className="h-12 bg-base-300 rounded flex-1" />
                <div className="h-12 bg-base-300 rounded flex-1" />
            </div>
        </div>
    );
};

export { TableSkeleton, CardSkeleton, StatSkeleton, FormSkeleton };
export default TableSkeleton;
