/**
 * Accordion Component
 *
 * A customized wrapper around PrimeReact's Accordion component
 * that provides a consistent design system for the application.
 */

import { Accordion as PrimeAccordion, AccordionTab } from 'primereact/accordion';
import type { AccordionTabChangeEvent } from 'primereact/accordion';
import type { ReactNode } from 'react';
import { CaretRightIcon, CaretUpIcon } from '@phosphor-icons/react';
import '../../styles/accordion.css';
import ProgressIndicator from './ProgressIndicator';

export interface AccordionItem {
    /** Unique identifier for the accordion item */
    id: string;
    /** Title/header of the accordion item */
    title: string;
    /** Subtitle/description shown below the title */
    subtitle?: string;
    /** Content to display when expanded */
    content: ReactNode;
    /** Footer content (buttons, actions, etc.) */
    footer?: ReactNode;
    /** Whether this item is disabled */
    disabled?: boolean;
    /** Whether to show the progress indicator */
    showProgressIndicator?: boolean;
    /** Progress value (0-100) for the progress indicator */
    progress?: number;
}

export interface AccordionProperties {
    /** Array of accordion items */
    items: AccordionItem[];
    /** Whether multiple items can be open at once (default: false) */
    multiple?: boolean;
    /** Index or array of indices of active tabs (controlled mode) */
    activeIndex?: number | number[] | null;
    /** Callback when active tab changes */
    onTabChange?: (event: AccordionTabChangeEvent) => void;
    /** Custom className for the accordion container */
    className?: string;
    /** Custom icon for collapsed state (default: CaretDown from Phosphor) */
    expandIcon?: ReactNode;
    /** Custom icon for expanded state (default: CaretDown from Phosphor) */
    collapseIcon?: ReactNode;
}

function Accordion({ items, multiple = false, activeIndex, onTabChange, className = '', expandIcon, collapseIcon }: AccordionProperties) {
    // Default icons using Phosphor Icons (already in your project)
    const defaultExpandIcon = expandIcon || <CaretRightIcon size={24} weight="fill" style={{ color: 'var(--color-gray-700)' }} />;
    const defaultCollapseIcon = collapseIcon || <CaretUpIcon size={24} weight="fill" className="rotate-180" />;

    return (
        <div className={`custom-accordion ${className}`}>
            <PrimeAccordion
                multiple={multiple}
                activeIndex={activeIndex}
                onTabChange={onTabChange}
                expandIcon={defaultExpandIcon}
                collapseIcon={defaultCollapseIcon}
            >
                {items.map(item => (
                    <AccordionTab
                        key={item.id}
                        header={
                            <div className="accordion-header-content">
                                <div className="flex-1">
                                    <div className="accordion-title">{item.title}</div>
                                    {item.subtitle && <div className="accordion-subtitle">{item.subtitle}</div>}
                                </div>
                                {item.showProgressIndicator && (
                                    <div className="ml-auto">
                                        <ProgressIndicator progress={item.progress || 0} size={50} strokeWidth={4} showPercentage />
                                    </div>
                                )}
                            </div>
                        }
                        disabled={item.disabled}
                    >
                        <div className="accordion-content">
                            {item.content}
                            {item.footer && <div className="accordion-footer mt-4">{item.footer}</div>}
                        </div>
                    </AccordionTab>
                ))}
            </PrimeAccordion>
        </div>
    );
}

export default Accordion;
