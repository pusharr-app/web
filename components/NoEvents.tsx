import { AnnotationIcon } from '@heroicons/react/solid';

export const NoEvents = () => {
  return (
    <tr>
      <td colSpan={6}>
        <div className="text-center my-10">
          <div className="rounded-full mx-auto h-12 w-12 flex items-center justify-center bg-red-500">
            <AnnotationIcon className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No events captured
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Set up your downloaders to send events
            <br />
            to Pusharr to populate this view.
          </p>
        </div>
      </td>
    </tr>
  );
};
