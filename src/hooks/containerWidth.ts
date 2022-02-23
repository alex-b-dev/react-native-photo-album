import { useCallback, useMemo, useRef, useState } from "react";
import { ResizeObserverProvider } from "../types";

const useContainerWidth = (resizeObserverProvider?: ResizeObserverProvider, breakpoints?: number[]) => {
    const observerRef = useRef<ResizeObserver>();
    const [containerWidth, setContainerWidth] = useState<number>();

    const containerRef = useCallback(
        (node) => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = undefined;
            }

            const updateWidth = () => {
                let newWidth = node?.clientWidth;

                if (newWidth !== undefined && breakpoints && breakpoints.length > 0) {
                    const sortedBreakpoints = [...breakpoints.filter((x) => x > 0)].sort((a, b) => b - a);
                    sortedBreakpoints.push(Math.floor(sortedBreakpoints[sortedBreakpoints.length - 1] / 2));
                    newWidth = sortedBreakpoints.find(
                        (breakpoint, index) => breakpoint <= newWidth || index === sortedBreakpoints.length - 1
                    );
                }

                setContainerWidth(newWidth);
            };

            updateWidth();

            if (node) {
                observerRef.current =
                    typeof ResizeObserver !== "undefined"
                        ? new ResizeObserver(updateWidth)
                        : resizeObserverProvider?.(updateWidth);

                observerRef.current?.observe(node);
            }
        },
        [resizeObserverProvider, breakpoints]
    );

    return useMemo(() => ({ containerRef, containerWidth }), [containerRef, containerWidth]);
};

export default useContainerWidth;
