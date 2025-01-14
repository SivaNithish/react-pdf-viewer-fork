/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs } from '@react-pdf-viewer/core';
import { getPage, useIsMounted } from '@react-pdf-viewer/core';
import * as React from 'react';
import { PageThumbnail } from './PageThumbnail';

interface PageState {
    height: number;
    page: PdfJs.Page | null;
    viewportRotation: number;
    width: number;
}

export const PageThumbnailContainer: React.FC<{
    canvas: HTMLCanvasElement;
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageIndex: number;
    pageRotation: number;
    pageWidth: number;
    rotation: number;
    shouldRender: boolean;
    onLoad(): void;
}> = ({ canvas, doc, pageHeight, pageIndex, pageRotation, pageWidth, rotation, shouldRender, onLoad }) => {
    const isMounted = useIsMounted();
    const [pageSize, setPageSize] = React.useState<PageState>({
        height: pageHeight,
        page: null,
        viewportRotation: 0,
        width: pageWidth,
    });
    const { page, height, width } = pageSize;
    const isVertical = Math.abs(rotation + pageRotation) % 180 === 0;

    React.useEffect(() => {
        if (shouldRender) {
            getPage(doc, pageIndex).then((pdfPage) => {
                const viewport = pdfPage.getViewport({ scale: 1 });

                isMounted.current &&
                    setPageSize({
                        height: viewport.height,
                        page: pdfPage,
                        viewportRotation: viewport.rotation,
                        width: viewport.width,
                    });
            });
        }
    }, [shouldRender]);

    // To support the document which is already rotated
    const rotationNumber = (pageSize.viewportRotation + rotation + pageRotation) % 360;

    return (
        page && (
            <PageThumbnail
                canvas={canvas}
                page={page}
                pageHeight={isVertical ? height : width}
                pageIndex={pageIndex}
                pageWidth={isVertical ? width : height}
                rotation={rotationNumber}
                onLoad={onLoad}
            />
        )
    );
};
