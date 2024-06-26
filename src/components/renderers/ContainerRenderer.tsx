import * as React from "react";
import { View } from "react-native";

import clsx from "../../utils/clsx";
import { Optional, RenderContainer, RenderContainerProps } from "../../types";

function defaultRenderContainer({ containerProps, children, containerRef }: RenderContainerProps) {
  return (
    <View ref={containerRef} {...containerProps}>
      {children}
    </View>
  );
}

export type ContainerRendererProps = Optional<RenderContainerProps, "containerProps"> & {
  renderContainer?: RenderContainer;
};

export default function ContainerRenderer(props: ContainerRendererProps) {
  const {
    layout,
    renderContainer,
    children,
    containerRef,
    containerProps: { style, className, ...restContainerProps } = {},
  } = props;

  const containerProps = {
    className: clsx("react-photo-album", `react-photo-album--${layout}`, className),
    style: {
      display: "flex",
      flexWrap: "nowrap",
      justifyContent: "space-between",
      flexDirection: layout === "rows" ? "column" : "row",
      ...style,
    } as const,
    ...restContainerProps,
  };

  return (
    <>
      {(renderContainer ?? defaultRenderContainer)({
        containerProps,
        containerRef,
        layout,
        children,
      })}
    </>
  );
}
