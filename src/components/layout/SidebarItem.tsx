import LinkButton from '../common/LinkButton';
import type { NavItem } from './Sidebar';

function SidebarItem({ item, depth, currentPath }: { item: NavItem; depth: number; currentPath: string }) {
    const isNested = depth > 0;

    const isActive = depth === 0 ? currentPath === item.path : currentPath === item.path || currentPath.startsWith(`${item.path}/`);

    return (
        <div>
            <LinkButton
                to={item.path}
                className={`
                    flex justify-start items-center rounded text-xs transition-colors gap-2.5
                    ${isNested ? `pl-9.5 pr-2 py-2.5` : 'px-2 py-3'}
                    ${isNested ? 'font-normal' : 'font-medium'}
                    ${isActive ? 'bg-brand-primary-500 text-white' : 'text-primary-text hover:bg-gray-100'}
                `}
            >
                {/* Only show icon for top-level items */}
                {!isNested && item.icon && <span className={`text-lg ${isActive ? 'text-white' : 'text-primary-text'}`}>{item.icon}</span>}

                <span>{item.label}</span>
            </LinkButton>

            {/* Recursive nested items */}
            {item.children && (
                <div className="flex flex-col gap-0.5">
                    {item.children.map(child => (
                        <SidebarItem key={child.path} item={child} depth={depth + 1} currentPath={currentPath} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SidebarItem;
