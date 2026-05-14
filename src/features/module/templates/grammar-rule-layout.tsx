import { DndProvider } from '@/app/providers/dnd-provider';
import { DraftWindowsModal } from '@/components/modal';
import { useGetGrammarRuleContent } from '@/features/module/hooks/api/queries/use-get-grammar-rule-content';
import { NotFound } from '@/templates/not-found';
import { useEffect } from 'react';
import { Outlet, useBlocker, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { GrammarRuleWindowList } from '../components/grammar-rule-window-list';
import FormPresentationPageSkeleton from '../components/presentation-page-skeleton';
import { useUpdateGrammarRuleWindows } from '../hooks/api/mutations/use-update-grammar-rule-windows';
import {
    useGrammarRuleModuleWindows,
    type WindowsType,
} from '../stores/use-grammar-rule-module-windows';

export const GrammarRuleLayout = () => {
  const navigate = useNavigate();
  const { moduleId, grammarRuleId } = useParams();

  const { data: windows, isLoading: isLoadingWindows } =
    useGetGrammarRuleContent(moduleId, grammarRuleId);

  const updateGrammarRuleWindows = useUpdateGrammarRuleWindows();

  const windowsList = useGrammarRuleModuleWindows((state) => state.windowsList);
  const setWindowsList = useGrammarRuleModuleWindows(
    (state) => state.setWindowsList,
  );
  const currentPosition = useGrammarRuleModuleWindows(
    (state) => state.currentPosition,
  );
  const setCurrentPosition = useGrammarRuleModuleWindows(
    (state) => state.setCurrentPosition,
  );

  const hasDraftWindows = windowsList.some((w) => !w.id);

  const blocker = useBlocker(({ nextLocation }) => {
    if (!moduleId || !grammarRuleId) return false;

    const grammarRuleBasePath = `/modules/create/${moduleId}/grammarRule/${grammarRuleId}`;
    const isNavigatingWithinEditor =
      nextLocation.pathname.startsWith(grammarRuleBasePath);

    return !isNavigatingWithinEditor;
  });

  useEffect(() => {
    if (blocker.state === 'blocked' && !hasDraftWindows) {
      onSendWindowsPosition(windowsList);
      blocker.proceed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker, hasDraftWindows, windowsList]);

  const handleConfirmNavigation = () => {
    if (blocker.state === 'blocked') {
      const windowsToSave = windowsList.filter((w) => w.id);
      onSendWindowsPosition(windowsToSave);
      blocker.proceed();
    }
  };

  const handleCancelNavigation = () => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  };

  const currentWindow =
    currentPosition !== null ? windowsList[currentPosition] : null;
  const uniqueKey = currentWindow?.id ?? currentWindow?.clientId;

  useEffect(() => {
    if (windows) {
      const windowsWithClientId = windows.map(
        (w) =>
          ({
            ...w,
            clientId: w.id,
          }) as WindowsType,
      );
      setWindowsList(windowsWithClientId);
      setCurrentPosition(0);
    } else if (!isLoadingWindows) {
      setWindowsList([{ type: 'PRESENTATION', clientId: crypto.randomUUID() }]);
      setCurrentPosition(0);
    }
  }, [windows, isLoadingWindows, setWindowsList, setCurrentPosition, grammarRuleId]);

  useEffect(() => {
    if (
      currentPosition !== null &&
      windowsList.length > 0 &&
      windowsList[currentPosition]
    ) {
      const currentWindow = windowsList[currentPosition];

      const pathSegments = [currentWindow.type.toLowerCase()];

      if (currentWindow.type === 'EXERCISE' && currentWindow.style) {
        pathSegments.push(currentWindow.style.toLowerCase());
      }

      if (currentWindow.id) {
        pathSegments.push(currentWindow.id);
      }

      const path = pathSegments.join('/');

      navigate(path, { replace: true });
    }
  }, [currentPosition, windowsList, navigate]);

  if (isLoadingWindows) {
    return <FormPresentationPageSkeleton />;
  }

  if (!moduleId || !grammarRuleId) return <NotFound />;

  const onSendWindowsPosition = (data: WindowsType[]) => {
    const windowsWithId = data
      .filter((w) => w.id)
      .map((w) => {
        if (w.type === 'EXERCISE') {
          return { id: w.id, type: w.type, style: w.style };
        }
        return { id: w.id, type: w.type };
      });

    updateGrammarRuleWindows.mutate(
      { moduleId, data: windowsWithId, grammarRuleId },
      {
        onSuccess: () =>
          toast.success('Ordem das janelas alteradas com sucesso!'),
      },
    );
  };

  return (
    <DndProvider key={grammarRuleId}>
      <div>
        <Outlet key={uniqueKey} />
        <GrammarRuleWindowList />
        <DraftWindowsModal
          key={'grammar-rule'}
          isOpen={blocker.state === 'blocked' && hasDraftWindows}
          onCancel={handleCancelNavigation}
          onConfirm={handleConfirmNavigation}
          windowsList={windowsList}
        />
      </div>
    </DndProvider>
  );
};
