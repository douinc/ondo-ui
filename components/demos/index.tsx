import type { ComponentType } from "react"
import AccordionBasic from "@/components/demos/accordion-basic"
import AccordionBorders from "@/components/demos/accordion-borders"
import AccordionCard from "@/components/demos/accordion-card"
import AccordionDemo from "@/components/demos/accordion-demo"
import AccordionDisabled from "@/components/demos/accordion-disabled"
import AccordionMultiple from "@/components/demos/accordion-multiple"
import AlertAction from "@/components/demos/alert-action"
import AlertBasic from "@/components/demos/alert-basic"
import AlertCustomColors from "@/components/demos/alert-custom-colors"
import AlertDemo from "@/components/demos/alert-demo"
import AlertDestructive from "@/components/demos/alert-destructive"
import AlertDialogBasic from "@/components/demos/alert-dialog-basic"
import AlertDialogDemo from "@/components/demos/alert-dialog-demo"
import AlertDialogDestructive from "@/components/demos/alert-dialog-destructive"
import AlertDialogMedia from "@/components/demos/alert-dialog-media"
import AlertDialogSmall from "@/components/demos/alert-dialog-small"
import AlertDialogSmallWithMedia from "@/components/demos/alert-dialog-small-with-media"
import AlertInfo from "@/components/demos/alert-info"
import AlertPrimary from "@/components/demos/alert-primary"
import AlertSuccess from "@/components/demos/alert-success"
import AlertWarning from "@/components/demos/alert-warning"
import AspectRatioDemo from "@/components/demos/aspect-ratio-demo"
import AspectRatioPortrait from "@/components/demos/aspect-ratio-portrait"
import AspectRatioSquare from "@/components/demos/aspect-ratio-square"
import AttachmentDemo from "@/components/demos/attachment-demo"
import AttachmentGroup from "@/components/demos/attachment-group"
import AttachmentImage from "@/components/demos/attachment-image"
import AttachmentSizes from "@/components/demos/attachment-sizes"
import AttachmentStates from "@/components/demos/attachment-states"
import AttachmentTrigger from "@/components/demos/attachment-trigger"
import AvatarAvatarGroup from "@/components/demos/avatar-avatar-group"
import AvatarAvatarGroupCount from "@/components/demos/avatar-avatar-group-count"
import AvatarAvatarGroupWithIcon from "@/components/demos/avatar-avatar-group-with-icon"
import AvatarBadge from "@/components/demos/avatar-badge"
import AvatarBadgeWithIcon from "@/components/demos/avatar-badge-with-icon"
import AvatarBasic from "@/components/demos/avatar-basic"
import AvatarDemo from "@/components/demos/avatar-demo"
import AvatarDropdown from "@/components/demos/avatar-dropdown"
import AvatarSizes from "@/components/demos/avatar-sizes"
import BadgeCustomColors from "@/components/demos/badge-custom-colors"
import BadgeDemo from "@/components/demos/badge-demo"
import BadgeLink from "@/components/demos/badge-link"
import BadgeVariants from "@/components/demos/badge-variants"
import BadgeWithIcon from "@/components/demos/badge-with-icon"
import BadgeWithSpinner from "@/components/demos/badge-with-spinner"
import BreadcrumbBasic from "@/components/demos/breadcrumb-basic"
import BreadcrumbCollapsed from "@/components/demos/breadcrumb-collapsed"
import BreadcrumbCustomSeparator from "@/components/demos/breadcrumb-custom-separator"
import BreadcrumbDemo from "@/components/demos/breadcrumb-demo"
import BreadcrumbDropdown from "@/components/demos/breadcrumb-dropdown"
import BreadcrumbLinkComponent from "@/components/demos/breadcrumb-link-component"
import BubbleAlignment from "@/components/demos/bubble-alignment"
import BubbleBubbleGroup from "@/components/demos/bubble-bubble-group"
import BubbleDemo from "@/components/demos/bubble-demo"
import BubbleLinksAndButtons from "@/components/demos/bubble-links-and-buttons"
import BubblePopover from "@/components/demos/bubble-popover"
import BubbleReactions from "@/components/demos/bubble-reactions"
import BubbleShowMoreCollapsible from "@/components/demos/bubble-show-more-collapsible"
import BubbleTooltip from "@/components/demos/bubble-tooltip"
import BubbleVariants from "@/components/demos/bubble-variants"
import ButtonDemo from "@/components/demos/button-demo"
import ButtonSizes from "@/components/demos/button-sizes"
import ButtonVariants from "@/components/demos/button-variants"
import ButtonGroupDemo from "@/components/demos/button-group-demo"
import ButtonGroupDropdownMenu from "@/components/demos/button-group-dropdown-menu"
import ButtonGroupInput from "@/components/demos/button-group-input"
import ButtonGroupInputGroup from "@/components/demos/button-group-input-group"
import ButtonGroupNested from "@/components/demos/button-group-nested"
import ButtonGroupOrientation from "@/components/demos/button-group-orientation"
import ButtonGroupPopover from "@/components/demos/button-group-popover"
import ButtonGroupSelect from "@/components/demos/button-group-select"
import ButtonGroupSeparator from "@/components/demos/button-group-separator"
import ButtonGroupSize from "@/components/demos/button-group-size"
import ButtonGroupSplit from "@/components/demos/button-group-split"
import CalendarBasic from "@/components/demos/calendar-basic"
import CalendarBookedDates from "@/components/demos/calendar-booked-dates"
import CalendarCustomCellSize from "@/components/demos/calendar-custom-cell-size"
import CalendarDateAndTimePicker from "@/components/demos/calendar-date-and-time-picker"
import CalendarDemo from "@/components/demos/calendar-demo"
import CalendarMonthAndYearSelector from "@/components/demos/calendar-month-and-year-selector"
import CalendarPresets from "@/components/demos/calendar-presets"
import CalendarRangeCalendar from "@/components/demos/calendar-range-calendar"
import CalendarWeekNumbers from "@/components/demos/calendar-week-numbers"
import CardDemo from "@/components/demos/card-demo"
import CardImage from "@/components/demos/card-image"
import CardSize from "@/components/demos/card-size"
import CardSpacing from "@/components/demos/card-spacing"
import CarouselDemo from "@/components/demos/carousel-demo"
import CarouselOrientation from "@/components/demos/carousel-orientation"
import CarouselSizes from "@/components/demos/carousel-sizes"
import CarouselSpacing from "@/components/demos/carousel-spacing"
import ChartDemo from "@/components/demos/chart-demo"
import ChartExample from "@/components/demos/chart-example"
import ChartBarDemoAxis from "@/components/demos/chart-example-axis"
import ChartBarDemoGrid from "@/components/demos/chart-example-grid"
import ChartBarDemoLegend from "@/components/demos/chart-example-legend"
import ChartBarDemoTooltip from "@/components/demos/chart-example-tooltip"
import ChartTooltipDemo from "@/components/demos/chart-tooltip"
import CheckboxBasic from "@/components/demos/checkbox-basic"
import CheckboxDemo from "@/components/demos/checkbox-demo"
import CheckboxDescription from "@/components/demos/checkbox-description"
import CheckboxDisabled from "@/components/demos/checkbox-disabled"
import CheckboxGroup from "@/components/demos/checkbox-group"
import CheckboxTable from "@/components/demos/checkbox-table"
import CollapsibleBasic from "@/components/demos/collapsible-basic"
import CollapsibleDemo from "@/components/demos/collapsible-demo"
import CollapsibleFileTree from "@/components/demos/collapsible-file-tree"
import CollapsibleSettingsPanel from "@/components/demos/collapsible-settings-panel"
import ComboboxAutoHighlight from "@/components/demos/combobox-auto-highlight"
import ComboboxBasic from "@/components/demos/combobox-basic"
import ComboboxClearButton from "@/components/demos/combobox-clear-button"
import ComboboxCustomItems from "@/components/demos/combobox-custom-items"
import ComboboxDemo from "@/components/demos/combobox-demo"
import ComboboxDisabled from "@/components/demos/combobox-disabled"
import ComboboxGroups from "@/components/demos/combobox-groups"
import ComboboxInputGroup from "@/components/demos/combobox-input-group"
import ComboboxInvalid from "@/components/demos/combobox-invalid"
import ComboboxMultiple from "@/components/demos/combobox-multiple"
import ComboboxPopup from "@/components/demos/combobox-popup"
import ComboboxSize from "@/components/demos/combobox-size"
import CommandBasic from "@/components/demos/command-basic"
import CommandDemo from "@/components/demos/command-demo"
import CommandGroups from "@/components/demos/command-groups"
import CommandScrollable from "@/components/demos/command-scrollable"
import CommandShortcuts from "@/components/demos/command-shortcuts"
import ContextMenuBasic from "@/components/demos/context-menu-basic"
import ContextMenuCheckboxes from "@/components/demos/context-menu-checkboxes"
import ContextMenuDemo from "@/components/demos/context-menu-demo"
import ContextMenuDestructive from "@/components/demos/context-menu-destructive"
import ContextMenuGroups from "@/components/demos/context-menu-groups"
import ContextMenuIcons from "@/components/demos/context-menu-icons"
import ContextMenuRadio from "@/components/demos/context-menu-radio"
import ContextMenuShortcuts from "@/components/demos/context-menu-shortcuts"
import ContextMenuSides from "@/components/demos/context-menu-sides"
import ContextMenuSubmenu from "@/components/demos/context-menu-submenu"
import DesktopWindowDemo from "@/components/demos/desktop-window-demo"
import DesktopWindowInteractive from "@/components/demos/desktop-window-interactive"
import DesktopWindowPlatforms from "@/components/demos/desktop-window-platforms"
import DesktopWindowTitlebarChildren from "@/components/demos/desktop-window-titlebar-children"
import DialogCustomCloseButton from "@/components/demos/dialog-custom-close-button"
import DialogDemo from "@/components/demos/dialog-demo"
import DialogNoCloseButton from "@/components/demos/dialog-no-close-button"
import DialogScrollableContent from "@/components/demos/dialog-scrollable-content"
import DialogStickyFooter from "@/components/demos/dialog-sticky-footer"
import DrawerDemo from "@/components/demos/drawer-demo"
import DrawerNested from "@/components/demos/drawer-nested"
import DrawerNonModal from "@/components/demos/drawer-non-modal"
import DrawerPosition from "@/components/demos/drawer-position"
import DrawerResponsive from "@/components/demos/drawer-responsive"
import DrawerSnapPoints from "@/components/demos/drawer-snap-points"
import DrawerSwipeHandle from "@/components/demos/drawer-swipe-handle"
import DropdownMenuAvatar from "@/components/demos/dropdown-menu-avatar"
import DropdownMenuBasic from "@/components/demos/dropdown-menu-basic"
import DropdownMenuCheckboxes from "@/components/demos/dropdown-menu-checkboxes"
import DropdownMenuCheckboxesIcons from "@/components/demos/dropdown-menu-checkboxes-icons"
import DropdownMenuComplex from "@/components/demos/dropdown-menu-complex"
import DropdownMenuDemo from "@/components/demos/dropdown-menu-demo"
import DropdownMenuDestructive from "@/components/demos/dropdown-menu-destructive"
import DropdownMenuIcons from "@/components/demos/dropdown-menu-icons"
import DropdownMenuRadioGroup from "@/components/demos/dropdown-menu-radio-group"
import DropdownMenuRadioIcons from "@/components/demos/dropdown-menu-radio-icons"
import DropdownMenuShortcuts from "@/components/demos/dropdown-menu-shortcuts"
import DropdownMenuSubmenu from "@/components/demos/dropdown-menu-submenu"
import EmptyAvatar from "@/components/demos/empty-avatar"
import EmptyAvatarGroup from "@/components/demos/empty-avatar-group"
import EmptyBackground from "@/components/demos/empty-background"
import EmptyDemo from "@/components/demos/empty-demo"
import EmptyInputGroup from "@/components/demos/empty-inputgroup"
import EmptyOutline from "@/components/demos/empty-outline"
import EmptyViewActions from "@/components/demos/empty-view-actions"
import EmptyViewBasic from "@/components/demos/empty-view-basic"
import EmptyViewDemo from "@/components/demos/empty-view-demo"
import FieldCheckbox from "@/components/demos/field-checkbox"
import FieldChoiceCard from "@/components/demos/field-choice-card"
import FieldDemo from "@/components/demos/field-demo"
import FieldFieldGroup from "@/components/demos/field-field-group"
import FieldFieldset from "@/components/demos/field-fieldset"
import FieldInput from "@/components/demos/field-input"
import FieldRadio from "@/components/demos/field-radio"
import FieldSelect from "@/components/demos/field-select"
import FieldSlider from "@/components/demos/field-slider"
import FieldSwitch from "@/components/demos/field-switch"
import FieldTextarea from "@/components/demos/field-textarea"
import FrameDemo from "@/components/demos/frame-demo"
import FrameDensePanels from "@/components/demos/frame-dense-panels"
import FrameGhost from "@/components/demos/frame-ghost"
import FrameRadius from "@/components/demos/frame-radius"
import FrameSeparatedPanels from "@/components/demos/frame-separated-panels"
import FrameSpacing from "@/components/demos/frame-spacing"
import FrameStackedPanels from "@/components/demos/frame-stacked-panels"
import HeadingDemo from "@/components/demos/heading-demo"
import HeadingLevelAndSize from "@/components/demos/heading-level-and-size"
import HeadingLevels from "@/components/demos/heading-levels"
import HeadingRender from "@/components/demos/heading-render"
import HeadingSizes from "@/components/demos/heading-sizes"
import HeadingWrap from "@/components/demos/heading-wrap"
import HoverCardBasic from "@/components/demos/hover-card-basic"
import HoverCardDemo from "@/components/demos/hover-card-demo"
import HoverCardSides from "@/components/demos/hover-card-sides"
import InputBadge from "@/components/demos/input-badge"
import InputBasic from "@/components/demos/input-basic"
import InputButtonGroup from "@/components/demos/input-button-group"
import InputDemo from "@/components/demos/input-demo"
import InputDisabled from "@/components/demos/input-disabled"
import InputField from "@/components/demos/input-field"
import InputFieldGroup from "@/components/demos/input-field-group"
import InputFile from "@/components/demos/input-file"
import InputForm from "@/components/demos/input-form"
import InputGrid from "@/components/demos/input-grid"
import InputInline from "@/components/demos/input-inline"
import InputSizes from "@/components/demos/input-sizes"
import InputGroupButton from "@/components/demos/input-group-button"
import InputGroupCustomInput from "@/components/demos/input-group-custom-input"
import InputGroupDemo from "@/components/demos/input-group-demo"
import InputGroupDropdown from "@/components/demos/input-group-dropdown"
import InputGroupBlockEnd from "@/components/demos/input-group-block-end"
import InputGroupBlockStart from "@/components/demos/input-group-block-start"
import InputGroupInlineEnd from "@/components/demos/input-group-inline-end"
import InputGroupInlineStart from "@/components/demos/input-group-inline-start"
import InputGroupIcon from "@/components/demos/input-group-icon"
import InputGroupKbd from "@/components/demos/input-group-kbd"
import InputGroupSize from "@/components/demos/input-group-size"
import InputGroupSpinner from "@/components/demos/input-group-spinner"
import InputGroupText from "@/components/demos/input-group-text"
import InputGroupTextarea from "@/components/demos/input-group-textarea"
import InputInputGroup from "@/components/demos/input-input-group"
import InputInvalid from "@/components/demos/input-invalid"
import InputOTPAlphanumeric from "@/components/demos/input-otp-alphanumeric"
import InputOTPControlled from "@/components/demos/input-otp-controlled"
import InputOTPDemo from "@/components/demos/input-otp-demo"
import InputOTPDisabled from "@/components/demos/input-otp-disabled"
import InputOTPFourDigits from "@/components/demos/input-otp-four-digits"
import InputOTPForm from "@/components/demos/input-otp-form"
import InputOTPInvalid from "@/components/demos/input-otp-invalid"
import InputOTPSeparator from "@/components/demos/input-otp-separator"
import InputRequired from "@/components/demos/input-required"
import ItemAvatar from "@/components/demos/item-avatar"
import ItemDemo from "@/components/demos/item-demo"
import ItemDropdown from "@/components/demos/item-dropdown"
import ItemGroup from "@/components/demos/item-group"
import ItemHeader from "@/components/demos/item-header"
import ItemIcon from "@/components/demos/item-icon"
import ItemImage from "@/components/demos/item-image"
import ItemLink from "@/components/demos/item-link"
import KbdButton from "@/components/demos/kbd-button"
import KbdDemo from "@/components/demos/kbd-demo"
import KbdGroup from "@/components/demos/kbd-group"
import KbdInputGroup from "@/components/demos/kbd-input-group"
import KbdTooltip from "@/components/demos/kbd-tooltip"
import LabelDemo from "@/components/demos/label-demo"
import LiveWaveformCustom from "@/components/demos/live-waveform-custom"
import LiveWaveformDemo from "@/components/demos/live-waveform-demo"
import LiveWaveformGeometry from "@/components/demos/live-waveform-geometry"
import LiveWaveformProcessing from "@/components/demos/live-waveform-processing"
import LiveWaveformScrolling from "@/components/demos/live-waveform-scrolling"
import LiveWaveformStatic from "@/components/demos/live-waveform-static"
import MarkerBorder from "@/components/demos/marker-border"
import MarkerDemo from "@/components/demos/marker-demo"
import MarkerLinksAndButtons from "@/components/demos/marker-links-and-buttons"
import MarkerSeparator from "@/components/demos/marker-separator"
import MarkerShimmer from "@/components/demos/marker-shimmer"
import MarkerStatus from "@/components/demos/marker-status"
import MarkerVariants from "@/components/demos/marker-variants"
import MarkerWithIcon from "@/components/demos/marker-with-icon"
import MenubarCheckbox from "@/components/demos/menubar-checkbox"
import MenubarDemo from "@/components/demos/menubar-demo"
import MenubarRadio from "@/components/demos/menubar-radio"
import MenubarSubmenu from "@/components/demos/menubar-submenu"
import MenubarWithIcons from "@/components/demos/menubar-with-icons"
import MessageActions from "@/components/demos/message-actions"
import MessageAttachment from "@/components/demos/message-attachment"
import MessageAvatar from "@/components/demos/message-avatar"
import MessageDemo from "@/components/demos/message-demo"
import MessageGroup from "@/components/demos/message-group"
import MessageHeaderAndFooter from "@/components/demos/message-header-and-footer"
import MessageScrollerAnchoring from "@/components/demos/message-scroller-anchoring"
import MessageScrollerAnimation from "@/components/demos/message-scroller-animation"
import MessageScrollerCommands from "@/components/demos/message-scroller-commands"
import MessageScrollerDemo from "@/components/demos/message-scroller-demo"
import MessageScrollerGroupChat from "@/components/demos/message-scroller-group-chat"
import MessageScrollerLoadHistory from "@/components/demos/message-scroller-load-history"
import MessageScrollerOpeningPosition from "@/components/demos/message-scroller-opening-position"
import MessageScrollerPreviousContext from "@/components/demos/message-scroller-previous-context"
import MessageScrollerScrollable from "@/components/demos/message-scroller-scrollable"
import MessageScrollerStreaming from "@/components/demos/message-scroller-streaming"
import MessageScrollerVisibility from "@/components/demos/message-scroller-visibility"
import MeterDemo from "@/components/demos/meter-demo"
import MeterFormat from "@/components/demos/meter-format"
import MeterLabelDemo from "@/components/demos/meter-label"
import MeterRingCustomValue from "@/components/demos/meter-ring-custom-value"
import MeterRingDemo from "@/components/demos/meter-ring-demo"
import MeterRingFormat from "@/components/demos/meter-ring-format"
import MeterRingSizes from "@/components/demos/meter-ring-sizes"
import MeterRingVariants from "@/components/demos/meter-ring-variants"
import MeterVariants from "@/components/demos/meter-variants"
import NativeSelectDemo from "@/components/demos/native-select-demo"
import NativeSelectDisabled from "@/components/demos/native-select-disabled"
import NativeSelectGroups from "@/components/demos/native-select-groups"
import NativeSelectInvalid from "@/components/demos/native-select-invalid"
import NativeSelectSize from "@/components/demos/native-select-size"
import NavigationMenuDemo from "@/components/demos/navigation-menu-demo"
import NumberBadgeDemo from "@/components/demos/number-badge-demo"
import NumberBadgeOverflow from "@/components/demos/number-badge-overflow"
import NumberBadgeVariants from "@/components/demos/number-badge-variants"
import NumberCountDemo from "@/components/demos/number-count-demo"
import NumberCountFormat from "@/components/demos/number-count-format"
import PaginationDemo from "@/components/demos/pagination-demo"
import PaginationIconsOnly from "@/components/demos/pagination-icons-only"
import PaginationSimple from "@/components/demos/pagination-simple"
import PopoverAlign from "@/components/demos/popover-align"
import PopoverBasic from "@/components/demos/popover-basic"
import PopoverDemo from "@/components/demos/popover-demo"
import PopoverWithForm from "@/components/demos/popover-with-form"
import ProgressControlled from "@/components/demos/progress-controlled"
import ProgressDemo from "@/components/demos/progress-demo"
import ProgressLabel from "@/components/demos/progress-label"
import ProgressNumberCount from "@/components/demos/progress-number-count"
import ProgressRingDemo from "@/components/demos/progress-ring-demo"
import ProgressRingIndeterminate from "@/components/demos/progress-ring-indeterminate"
import ProgressRingLabelDemo from "@/components/demos/progress-ring-label"
import ProgressRingNumberCount from "@/components/demos/progress-ring-number-count"
import ProgressRingSizes from "@/components/demos/progress-ring-sizes"
import ProgressRingVariants from "@/components/demos/progress-ring-variants"
import ProgressVariants from "@/components/demos/progress-variants"
import RadioGroupChoiceCard from "@/components/demos/radio-group-choice-card"
import RadioGroupDemo from "@/components/demos/radio-group-demo"
import RadioGroupDescription from "@/components/demos/radio-group-description"
import RadioGroupDisabled from "@/components/demos/radio-group-disabled"
import RadioGroupFieldset from "@/components/demos/radio-group-fieldset"
import RadioGroupInvalid from "@/components/demos/radio-group-invalid"
import ResizableDemo from "@/components/demos/resizable-demo"
import ResizableHandle from "@/components/demos/resizable-handle"
import ResizableVertical from "@/components/demos/resizable-vertical"
import ScrollAreaDemo from "@/components/demos/scroll-area-demo"
import ScrollAreaHorizontal from "@/components/demos/scroll-area-horizontal"
import ScrollFadeDemo from "@/components/demos/scroll-fade-demo"
import ScrollFadeEdge from "@/components/demos/scroll-fade-edge"
import ScrollFadeHorizontal from "@/components/demos/scroll-fade-horizontal"
import ScrollFadeNone from "@/components/demos/scroll-fade-none"
import ScrollFadeOverflow from "@/components/demos/scroll-fade-overflow"
import ScrollFadeSize from "@/components/demos/scroll-fade-size"
import SelectAlignItemWithTrigger from "@/components/demos/select-align-item-with-trigger"
import SelectDemo from "@/components/demos/select-demo"
import SelectDisabled from "@/components/demos/select-disabled"
import SelectGroups from "@/components/demos/select-groups"
import SelectInvalid from "@/components/demos/select-invalid"
import SelectScrollable from "@/components/demos/select-scrollable"
import SelectSize from "@/components/demos/select-size"
import { SeparatorDemo } from "@/components/demos/separator-demo"
import { SeparatorList } from "@/components/demos/separator-list"
import { SeparatorMenu } from "@/components/demos/separator-menu"
import { SeparatorVertical } from "@/components/demos/separator-vertical"
import SheetDemo from "@/components/demos/sheet-demo"
import SheetNoCloseButton from "@/components/demos/sheet-no-close-button"
import SheetSide from "@/components/demos/sheet-side"
import ShimmerAngle from "@/components/demos/shimmer-angle"
import ShimmerColor from "@/components/demos/shimmer-color"
import ShimmerDemo from "@/components/demos/shimmer-demo"
import ShimmerDuration from "@/components/demos/shimmer-duration"
import ShimmerMarker from "@/components/demos/shimmer-marker"
import ShimmerNone from "@/components/demos/shimmer-none"
import ShimmerOnce from "@/components/demos/shimmer-once"
import ShimmerSpread from "@/components/demos/shimmer-spread"
import SidebarDemo from "@/components/demos/sidebar-demo"
import SkeletonAvatar from "@/components/demos/skeleton-avatar"
import SkeletonCard from "@/components/demos/skeleton-card"
import SkeletonDemo from "@/components/demos/skeleton-demo"
import SkeletonForm from "@/components/demos/skeleton-form"
import SkeletonTable from "@/components/demos/skeleton-table"
import SkeletonText from "@/components/demos/skeleton-text"
import SliderControlled from "@/components/demos/slider-controlled"
import SliderDemo from "@/components/demos/slider-demo"
import SliderDisabled from "@/components/demos/slider-disabled"
import SliderMultipleThumbs from "@/components/demos/slider-multiple-thumbs"
import SliderRange from "@/components/demos/slider-range"
import SliderVertical from "@/components/demos/slider-vertical"
import { SpinnerBadge } from "@/components/demos/spinner-badge"
import { SpinnerButton } from "@/components/demos/spinner-button"
import { SpinnerDemo } from "@/components/demos/spinner-demo"
import { SpinnerEmpty } from "@/components/demos/spinner-empty"
import { SpinnerInputGroup } from "@/components/demos/spinner-input-group"
import { SpinnerSize } from "@/components/demos/spinner-size"
import { SwitchChoiceCard } from "@/components/demos/switch-choice-card"
import { SwitchDemo } from "@/components/demos/switch-demo"
import { SwitchDescription } from "@/components/demos/switch-description"
import { SwitchDisabled } from "@/components/demos/switch-disabled"
import { SwitchInvalid } from "@/components/demos/switch-invalid"
import { SwitchSize } from "@/components/demos/switch-size"
import { TableActions } from "@/components/demos/table-actions"
import { TableDemo } from "@/components/demos/table-demo"
import { TableFooter } from "@/components/demos/table-footer"
import { TabsDemo } from "@/components/demos/tabs-demo"
import { TabsDisabled } from "@/components/demos/tabs-disabled"
import { TabsIcons } from "@/components/demos/tabs-icons"
import { TabsLine } from "@/components/demos/tabs-line"
import { TabsVertical } from "@/components/demos/tabs-vertical"
import { TextareaButton } from "@/components/demos/textarea-button"
import { TextareaDemo } from "@/components/demos/textarea-demo"
import { TextareaDisabled } from "@/components/demos/textarea-disabled"
import { TextareaField } from "@/components/demos/textarea-field"
import { TextareaInvalid } from "@/components/demos/textarea-invalid"
import TextareaSizes from "@/components/demos/textarea-sizes"
import TimelineActivityFeed from "@/components/demos/timeline-activity-feed"
import TimelineAlternating from "@/components/demos/timeline-alternating"
import TimelineAnimate from "@/components/demos/timeline-animate"
import TimelineCompactRoadmap from "@/components/demos/timeline-compact-roadmap"
import TimelineCustomIndicators from "@/components/demos/timeline-custom-indicators"
import TimelineCustomized from "@/components/demos/timeline-customized"
import TimelineDemo from "@/components/demos/timeline-demo"
import TimelineHorizontal from "@/components/demos/timeline-horizontal"
import TimelineHorizontalTopIndicators from "@/components/demos/timeline-horizontal-top-indicators"
import TimelineIcons from "@/components/demos/timeline-icons"
import TimelineLeftAlignedDates from "@/components/demos/timeline-left-aligned-dates"
import ToastDemo from "@/components/demos/toast-demo"
import ToastPromise from "@/components/demos/toast-promise"
import ToastTypes from "@/components/demos/toast-types"
import { ToggleDemo } from "@/components/demos/toggle-demo"
import { ToggleDisabled } from "@/components/demos/toggle-disabled"
import { ToggleOutline } from "@/components/demos/toggle-outline"
import { ToggleSize } from "@/components/demos/toggle-size"
import { ToggleWithText } from "@/components/demos/toggle-with-text"
import { ToggleGroupCustom } from "@/components/demos/toggle-group-custom"
import { ToggleGroupDemo } from "@/components/demos/toggle-group-demo"
import { ToggleGroupDisabled } from "@/components/demos/toggle-group-disabled"
import { ToggleGroupOutline } from "@/components/demos/toggle-group-outline"
import { ToggleGroupSize } from "@/components/demos/toggle-group-size"
import { ToggleGroupSpacing } from "@/components/demos/toggle-group-spacing"
import { ToggleGroupVertical } from "@/components/demos/toggle-group-vertical"
import { TooltipDemo } from "@/components/demos/tooltip-demo"
import { TooltipDisabledButton } from "@/components/demos/tooltip-disabled-button"
import { TooltipSide } from "@/components/demos/tooltip-side"
import { TooltipWithKeyboardShortcut } from "@/components/demos/tooltip-with-keyboard-shortcut"

export const demos: Record<string, ComponentType> = {
  "accordion-basic": AccordionBasic,
  "accordion-borders": AccordionBorders,
  "accordion-card": AccordionCard,
  "accordion-demo": AccordionDemo,
  "accordion-disabled": AccordionDisabled,
  "accordion-multiple": AccordionMultiple,
  "alert-action": AlertAction,
  "alert-basic": AlertBasic,
  "alert-custom-colors": AlertCustomColors,
  "alert-demo": AlertDemo,
  "alert-destructive": AlertDestructive,
  "alert-dialog-basic": AlertDialogBasic,
  "alert-dialog-demo": AlertDialogDemo,
  "alert-dialog-destructive": AlertDialogDestructive,
  "alert-dialog-media": AlertDialogMedia,
  "alert-dialog-small": AlertDialogSmall,
  "alert-dialog-small-with-media": AlertDialogSmallWithMedia,
  "alert-info": AlertInfo,
  "alert-primary": AlertPrimary,
  "alert-success": AlertSuccess,
  "alert-warning": AlertWarning,
  "aspect-ratio-demo": AspectRatioDemo,
  "aspect-ratio-portrait": AspectRatioPortrait,
  "aspect-ratio-square": AspectRatioSquare,
  "attachment-demo": AttachmentDemo,
  "attachment-group": AttachmentGroup,
  "attachment-image": AttachmentImage,
  "attachment-sizes": AttachmentSizes,
  "attachment-states": AttachmentStates,
  "attachment-trigger": AttachmentTrigger,
  "avatar-avatar-group": AvatarAvatarGroup,
  "avatar-avatar-group-count": AvatarAvatarGroupCount,
  "avatar-avatar-group-with-icon": AvatarAvatarGroupWithIcon,
  "avatar-badge": AvatarBadge,
  "avatar-badge-with-icon": AvatarBadgeWithIcon,
  "avatar-basic": AvatarBasic,
  "avatar-demo": AvatarDemo,
  "avatar-dropdown": AvatarDropdown,
  "avatar-sizes": AvatarSizes,
  "badge-custom-colors": BadgeCustomColors,
  "badge-demo": BadgeDemo,
  "badge-link": BadgeLink,
  "badge-variants": BadgeVariants,
  "badge-with-icon": BadgeWithIcon,
  "badge-with-spinner": BadgeWithSpinner,
  "breadcrumb-basic": BreadcrumbBasic,
  "breadcrumb-collapsed": BreadcrumbCollapsed,
  "breadcrumb-custom-separator": BreadcrumbCustomSeparator,
  "breadcrumb-demo": BreadcrumbDemo,
  "breadcrumb-dropdown": BreadcrumbDropdown,
  "breadcrumb-link-component": BreadcrumbLinkComponent,
  "bubble-alignment": BubbleAlignment,
  "bubble-bubble-group": BubbleBubbleGroup,
  "bubble-demo": BubbleDemo,
  "bubble-links-and-buttons": BubbleLinksAndButtons,
  "bubble-popover": BubblePopover,
  "bubble-reactions": BubbleReactions,
  "bubble-show-more-collapsible": BubbleShowMoreCollapsible,
  "bubble-tooltip": BubbleTooltip,
  "bubble-variants": BubbleVariants,
  "button-demo": ButtonDemo,
  "button-sizes": ButtonSizes,
  "button-variants": ButtonVariants,
  "button-group-demo": ButtonGroupDemo,
  "button-group-dropdown-menu": ButtonGroupDropdownMenu,
  "button-group-input": ButtonGroupInput,
  "button-group-input-group": ButtonGroupInputGroup,
  "button-group-nested": ButtonGroupNested,
  "button-group-orientation": ButtonGroupOrientation,
  "button-group-popover": ButtonGroupPopover,
  "button-group-select": ButtonGroupSelect,
  "button-group-separator": ButtonGroupSeparator,
  "button-group-size": ButtonGroupSize,
  "button-group-split": ButtonGroupSplit,
  "calendar-basic": CalendarBasic,
  "calendar-booked-dates": CalendarBookedDates,
  "calendar-custom-cell-size": CalendarCustomCellSize,
  "calendar-date-and-time-picker": CalendarDateAndTimePicker,
  "calendar-demo": CalendarDemo,
  "calendar-month-and-year-selector": CalendarMonthAndYearSelector,
  "calendar-presets": CalendarPresets,
  "calendar-range-calendar": CalendarRangeCalendar,
  "calendar-week-numbers": CalendarWeekNumbers,
  "card-demo": CardDemo,
  "card-image": CardImage,
  "card-size": CardSize,
  "card-spacing": CardSpacing,
  "carousel-demo": CarouselDemo,
  "carousel-orientation": CarouselOrientation,
  "carousel-sizes": CarouselSizes,
  "carousel-spacing": CarouselSpacing,
  "chart-demo": ChartDemo,
  "chart-example": ChartExample,
  "chart-example-axis": ChartBarDemoAxis,
  "chart-example-grid": ChartBarDemoGrid,
  "chart-example-legend": ChartBarDemoLegend,
  "chart-example-tooltip": ChartBarDemoTooltip,
  "chart-tooltip": ChartTooltipDemo,
  "checkbox-basic": CheckboxBasic,
  "checkbox-demo": CheckboxDemo,
  "checkbox-description": CheckboxDescription,
  "checkbox-disabled": CheckboxDisabled,
  "checkbox-group": CheckboxGroup,
  "checkbox-table": CheckboxTable,
  "collapsible-basic": CollapsibleBasic,
  "collapsible-demo": CollapsibleDemo,
  "collapsible-file-tree": CollapsibleFileTree,
  "collapsible-settings-panel": CollapsibleSettingsPanel,
  "combobox-auto-highlight": ComboboxAutoHighlight,
  "combobox-basic": ComboboxBasic,
  "combobox-clear-button": ComboboxClearButton,
  "combobox-custom-items": ComboboxCustomItems,
  "combobox-demo": ComboboxDemo,
  "combobox-disabled": ComboboxDisabled,
  "combobox-groups": ComboboxGroups,
  "combobox-input-group": ComboboxInputGroup,
  "combobox-invalid": ComboboxInvalid,
  "combobox-multiple": ComboboxMultiple,
  "combobox-popup": ComboboxPopup,
  "combobox-size": ComboboxSize,
  "command-basic": CommandBasic,
  "command-demo": CommandDemo,
  "command-groups": CommandGroups,
  "command-scrollable": CommandScrollable,
  "command-shortcuts": CommandShortcuts,
  "context-menu-basic": ContextMenuBasic,
  "context-menu-checkboxes": ContextMenuCheckboxes,
  "context-menu-demo": ContextMenuDemo,
  "context-menu-destructive": ContextMenuDestructive,
  "context-menu-groups": ContextMenuGroups,
  "context-menu-icons": ContextMenuIcons,
  "context-menu-radio": ContextMenuRadio,
  "context-menu-shortcuts": ContextMenuShortcuts,
  "context-menu-sides": ContextMenuSides,
  "context-menu-submenu": ContextMenuSubmenu,
  "desktop-window-demo": DesktopWindowDemo,
  "desktop-window-interactive": DesktopWindowInteractive,
  "desktop-window-platforms": DesktopWindowPlatforms,
  "desktop-window-titlebar-children": DesktopWindowTitlebarChildren,
  "dialog-custom-close-button": DialogCustomCloseButton,
  "dialog-demo": DialogDemo,
  "dialog-no-close-button": DialogNoCloseButton,
  "dialog-scrollable-content": DialogScrollableContent,
  "dialog-sticky-footer": DialogStickyFooter,
  "drawer-demo": DrawerDemo,
  "drawer-nested": DrawerNested,
  "drawer-non-modal": DrawerNonModal,
  "drawer-position": DrawerPosition,
  "drawer-responsive": DrawerResponsive,
  "drawer-snap-points": DrawerSnapPoints,
  "drawer-swipe-handle": DrawerSwipeHandle,
  "dropdown-menu-avatar": DropdownMenuAvatar,
  "dropdown-menu-basic": DropdownMenuBasic,
  "dropdown-menu-checkboxes": DropdownMenuCheckboxes,
  "dropdown-menu-checkboxes-icons": DropdownMenuCheckboxesIcons,
  "dropdown-menu-complex": DropdownMenuComplex,
  "dropdown-menu-demo": DropdownMenuDemo,
  "dropdown-menu-destructive": DropdownMenuDestructive,
  "dropdown-menu-icons": DropdownMenuIcons,
  "dropdown-menu-radio-group": DropdownMenuRadioGroup,
  "dropdown-menu-radio-icons": DropdownMenuRadioIcons,
  "dropdown-menu-shortcuts": DropdownMenuShortcuts,
  "dropdown-menu-submenu": DropdownMenuSubmenu,
  "empty-avatar": EmptyAvatar,
  "empty-avatar-group": EmptyAvatarGroup,
  "empty-background": EmptyBackground,
  "empty-demo": EmptyDemo,
  "empty-inputgroup": EmptyInputGroup,
  "empty-outline": EmptyOutline,
  "empty-view-actions": EmptyViewActions,
  "empty-view-basic": EmptyViewBasic,
  "empty-view-demo": EmptyViewDemo,
  "field-checkbox": FieldCheckbox,
  "field-choice-card": FieldChoiceCard,
  "field-demo": FieldDemo,
  "field-field-group": FieldFieldGroup,
  "field-fieldset": FieldFieldset,
  "field-input": FieldInput,
  "field-radio": FieldRadio,
  "field-select": FieldSelect,
  "field-slider": FieldSlider,
  "field-switch": FieldSwitch,
  "field-textarea": FieldTextarea,
  "frame-demo": FrameDemo,
  "frame-dense-panels": FrameDensePanels,
  "frame-ghost": FrameGhost,
  "frame-radius": FrameRadius,
  "frame-separated-panels": FrameSeparatedPanels,
  "frame-spacing": FrameSpacing,
  "frame-stacked-panels": FrameStackedPanels,
  "heading-demo": HeadingDemo,
  "heading-level-and-size": HeadingLevelAndSize,
  "heading-levels": HeadingLevels,
  "heading-render": HeadingRender,
  "heading-sizes": HeadingSizes,
  "heading-wrap": HeadingWrap,
  "hover-card-basic": HoverCardBasic,
  "hover-card-demo": HoverCardDemo,
  "hover-card-sides": HoverCardSides,
  "input-badge": InputBadge,
  "input-basic": InputBasic,
  "input-button-group": InputButtonGroup,
  "input-demo": InputDemo,
  "input-disabled": InputDisabled,
  "input-field": InputField,
  "input-field-group": InputFieldGroup,
  "input-file": InputFile,
  "input-form": InputForm,
  "input-grid": InputGrid,
  "input-inline": InputInline,
  "input-sizes": InputSizes,
  "input-group-button": InputGroupButton,
  "input-group-custom-input": InputGroupCustomInput,
  "input-group-demo": InputGroupDemo,
  "input-group-dropdown": InputGroupDropdown,
  "input-group-block-end": InputGroupBlockEnd,
  "input-group-block-start": InputGroupBlockStart,
  "input-group-inline-end": InputGroupInlineEnd,
  "input-group-inline-start": InputGroupInlineStart,
  "input-group-icon": InputGroupIcon,
  "input-group-kbd": InputGroupKbd,
  "input-group-size": InputGroupSize,
  "input-group-spinner": InputGroupSpinner,
  "input-group-text": InputGroupText,
  "input-group-textarea": InputGroupTextarea,
  "input-input-group": InputInputGroup,
  "input-invalid": InputInvalid,
  "input-otp-alphanumeric": InputOTPAlphanumeric,
  "input-otp-controlled": InputOTPControlled,
  "input-otp-demo": InputOTPDemo,
  "input-otp-disabled": InputOTPDisabled,
  "input-otp-four-digits": InputOTPFourDigits,
  "input-otp-form": InputOTPForm,
  "input-otp-invalid": InputOTPInvalid,
  "input-otp-separator": InputOTPSeparator,
  "input-required": InputRequired,
  "item-avatar": ItemAvatar,
  "item-demo": ItemDemo,
  "item-dropdown": ItemDropdown,
  "item-group": ItemGroup,
  "item-header": ItemHeader,
  "item-icon": ItemIcon,
  "item-image": ItemImage,
  "item-link": ItemLink,
  "kbd-button": KbdButton,
  "kbd-demo": KbdDemo,
  "kbd-group": KbdGroup,
  "kbd-input-group": KbdInputGroup,
  "kbd-tooltip": KbdTooltip,
  "label-demo": LabelDemo,
  "live-waveform-custom": LiveWaveformCustom,
  "live-waveform-demo": LiveWaveformDemo,
  "live-waveform-geometry": LiveWaveformGeometry,
  "live-waveform-processing": LiveWaveformProcessing,
  "live-waveform-scrolling": LiveWaveformScrolling,
  "live-waveform-static": LiveWaveformStatic,
  "marker-border": MarkerBorder,
  "marker-demo": MarkerDemo,
  "marker-links-and-buttons": MarkerLinksAndButtons,
  "marker-separator": MarkerSeparator,
  "marker-shimmer": MarkerShimmer,
  "marker-status": MarkerStatus,
  "marker-variants": MarkerVariants,
  "marker-with-icon": MarkerWithIcon,
  "menubar-checkbox": MenubarCheckbox,
  "menubar-demo": MenubarDemo,
  "menubar-radio": MenubarRadio,
  "menubar-submenu": MenubarSubmenu,
  "menubar-with-icons": MenubarWithIcons,
  "message-actions": MessageActions,
  "message-attachment": MessageAttachment,
  "message-avatar": MessageAvatar,
  "message-demo": MessageDemo,
  "message-group": MessageGroup,
  "message-header-and-footer": MessageHeaderAndFooter,
  "message-scroller-anchoring": MessageScrollerAnchoring,
  "message-scroller-animation": MessageScrollerAnimation,
  "message-scroller-commands": MessageScrollerCommands,
  "message-scroller-demo": MessageScrollerDemo,
  "message-scroller-group-chat": MessageScrollerGroupChat,
  "message-scroller-load-history": MessageScrollerLoadHistory,
  "message-scroller-opening-position": MessageScrollerOpeningPosition,
  "message-scroller-previous-context": MessageScrollerPreviousContext,
  "message-scroller-scrollable": MessageScrollerScrollable,
  "message-scroller-streaming": MessageScrollerStreaming,
  "message-scroller-visibility": MessageScrollerVisibility,
  "meter-demo": MeterDemo,
  "meter-format": MeterFormat,
  "meter-label": MeterLabelDemo,
  "meter-ring-custom-value": MeterRingCustomValue,
  "meter-ring-demo": MeterRingDemo,
  "meter-ring-format": MeterRingFormat,
  "meter-ring-sizes": MeterRingSizes,
  "meter-ring-variants": MeterRingVariants,
  "meter-variants": MeterVariants,
  "native-select-demo": NativeSelectDemo,
  "native-select-disabled": NativeSelectDisabled,
  "native-select-groups": NativeSelectGroups,
  "native-select-invalid": NativeSelectInvalid,
  "native-select-size": NativeSelectSize,
  "navigation-menu-demo": NavigationMenuDemo,
  "number-badge-demo": NumberBadgeDemo,
  "number-badge-overflow": NumberBadgeOverflow,
  "number-badge-variants": NumberBadgeVariants,
  "number-count-demo": NumberCountDemo,
  "number-count-format": NumberCountFormat,
  "pagination-demo": PaginationDemo,
  "pagination-icons-only": PaginationIconsOnly,
  "pagination-simple": PaginationSimple,
  "popover-align": PopoverAlign,
  "popover-basic": PopoverBasic,
  "popover-demo": PopoverDemo,
  "popover-with-form": PopoverWithForm,
  "progress-controlled": ProgressControlled,
  "progress-demo": ProgressDemo,
  "progress-label": ProgressLabel,
  "progress-number-count": ProgressNumberCount,
  "progress-ring-demo": ProgressRingDemo,
  "progress-ring-indeterminate": ProgressRingIndeterminate,
  "progress-ring-label": ProgressRingLabelDemo,
  "progress-ring-number-count": ProgressRingNumberCount,
  "progress-ring-sizes": ProgressRingSizes,
  "progress-ring-variants": ProgressRingVariants,
  "progress-variants": ProgressVariants,
  "radio-group-choice-card": RadioGroupChoiceCard,
  "radio-group-demo": RadioGroupDemo,
  "radio-group-description": RadioGroupDescription,
  "radio-group-disabled": RadioGroupDisabled,
  "radio-group-fieldset": RadioGroupFieldset,
  "radio-group-invalid": RadioGroupInvalid,
  "resizable-demo": ResizableDemo,
  "resizable-handle": ResizableHandle,
  "resizable-vertical": ResizableVertical,
  "scroll-area-demo": ScrollAreaDemo,
  "scroll-area-horizontal": ScrollAreaHorizontal,
  "scroll-fade-demo": ScrollFadeDemo,
  "scroll-fade-edge": ScrollFadeEdge,
  "scroll-fade-horizontal": ScrollFadeHorizontal,
  "scroll-fade-none": ScrollFadeNone,
  "scroll-fade-overflow": ScrollFadeOverflow,
  "scroll-fade-size": ScrollFadeSize,
  "select-align-item-with-trigger": SelectAlignItemWithTrigger,
  "select-demo": SelectDemo,
  "select-disabled": SelectDisabled,
  "select-groups": SelectGroups,
  "select-invalid": SelectInvalid,
  "select-scrollable": SelectScrollable,
  "select-size": SelectSize,
  "separator-demo": SeparatorDemo,
  "separator-list": SeparatorList,
  "separator-menu": SeparatorMenu,
  "separator-vertical": SeparatorVertical,
  "sheet-demo": SheetDemo,
  "sheet-no-close-button": SheetNoCloseButton,
  "sheet-side": SheetSide,
  "shimmer-angle": ShimmerAngle,
  "shimmer-color": ShimmerColor,
  "shimmer-demo": ShimmerDemo,
  "shimmer-duration": ShimmerDuration,
  "shimmer-marker": ShimmerMarker,
  "shimmer-none": ShimmerNone,
  "shimmer-once": ShimmerOnce,
  "shimmer-spread": ShimmerSpread,
  "sidebar-demo": SidebarDemo,
  "skeleton-avatar": SkeletonAvatar,
  "skeleton-card": SkeletonCard,
  "skeleton-demo": SkeletonDemo,
  "skeleton-form": SkeletonForm,
  "skeleton-table": SkeletonTable,
  "skeleton-text": SkeletonText,
  "slider-controlled": SliderControlled,
  "slider-demo": SliderDemo,
  "slider-disabled": SliderDisabled,
  "slider-multiple-thumbs": SliderMultipleThumbs,
  "slider-range": SliderRange,
  "slider-vertical": SliderVertical,
  "spinner-badge": SpinnerBadge,
  "spinner-button": SpinnerButton,
  "spinner-demo": SpinnerDemo,
  "spinner-empty": SpinnerEmpty,
  "spinner-input-group": SpinnerInputGroup,
  "spinner-size": SpinnerSize,
  "switch-choice-card": SwitchChoiceCard,
  "switch-demo": SwitchDemo,
  "switch-description": SwitchDescription,
  "switch-disabled": SwitchDisabled,
  "switch-invalid": SwitchInvalid,
  "switch-size": SwitchSize,
  "table-actions": TableActions,
  "table-demo": TableDemo,
  "table-footer": TableFooter,
  "tabs-demo": TabsDemo,
  "tabs-disabled": TabsDisabled,
  "tabs-icons": TabsIcons,
  "tabs-line": TabsLine,
  "tabs-vertical": TabsVertical,
  "textarea-button": TextareaButton,
  "textarea-demo": TextareaDemo,
  "textarea-disabled": TextareaDisabled,
  "textarea-field": TextareaField,
  "textarea-invalid": TextareaInvalid,
  "textarea-sizes": TextareaSizes,
  "timeline-activity-feed": TimelineActivityFeed,
  "timeline-alternating": TimelineAlternating,
  "timeline-animate": TimelineAnimate,
  "timeline-compact-roadmap": TimelineCompactRoadmap,
  "timeline-custom-indicators": TimelineCustomIndicators,
  "timeline-customized": TimelineCustomized,
  "timeline-demo": TimelineDemo,
  "timeline-horizontal": TimelineHorizontal,
  "timeline-horizontal-top-indicators": TimelineHorizontalTopIndicators,
  "timeline-icons": TimelineIcons,
  "timeline-left-aligned-dates": TimelineLeftAlignedDates,
  "toast-demo": ToastDemo,
  "toast-promise": ToastPromise,
  "toast-types": ToastTypes,
  "toggle-demo": ToggleDemo,
  "toggle-disabled": ToggleDisabled,
  "toggle-outline": ToggleOutline,
  "toggle-size": ToggleSize,
  "toggle-with-text": ToggleWithText,
  "toggle-group-custom": ToggleGroupCustom,
  "toggle-group-demo": ToggleGroupDemo,
  "toggle-group-disabled": ToggleGroupDisabled,
  "toggle-group-outline": ToggleGroupOutline,
  "toggle-group-size": ToggleGroupSize,
  "toggle-group-spacing": ToggleGroupSpacing,
  "toggle-group-vertical": ToggleGroupVertical,
  "tooltip-demo": TooltipDemo,
  "tooltip-disabled-button": TooltipDisabledButton,
  "tooltip-side": TooltipSide,
  "tooltip-with-keyboard-shortcut": TooltipWithKeyboardShortcut,
}
