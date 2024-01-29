declare module '@vkontakte/vkui' {
    type StateMode = 'opacity' | 'background' | 'none';
    export type StateModeLiteral = LiteralUnion<StateMode, string>;

    export interface StateProps {
        activeMode?: StateModeLiteral;
        hoverMode?: StateModeLiteral;
    }

    export interface LinkProps extends TappableProps {
        hasVisited?: boolean;
    }

    export interface TappableProps extends ClickableProps, StateProps {
        borderRadiusMode?: 'auto' | 'inherit';
    }

    export interface RootComponentProps<T> extends React.AllHTMLAttributes<T>, HasRootRef<T>, HasComponent {
        baseClassName?: string | false;
    }

    export interface HasRootRef<T> {
        getRootRef?: React.Ref<T>;
    }
    export interface HasComponent {
        Component?: React.ElementType;
    }

    export interface FocusVisibleModeProps {
        focusVisibleMode?: FocusVisibleMode;
    }

    export const focusVisiblePresetModeClassNames = {
        inside: styles['-focus-visible--mode-inside'],
        outside: styles['-focus-visible--mode-outside'],
    };
      
    type FocusVisiblePresetMode = keyof typeof focusVisiblePresetModeClassNames;
      
    export type FocusVisibleMode = LiteralUnion<FocusVisiblePresetMode, string>;

    export declare const Link: ({ hasVisited, children, className, onClick, ...restProps }: LinkProps) => React.JSX.Element

    export interface ClickableProps<T = HTMLElement> extends RootComponentProps<T>, FocusVisibleModeProps, StateProps {}
}