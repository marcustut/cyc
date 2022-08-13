/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';
import Youtube, { YouTubeProps } from 'react-youtube';
import { Fragment, useEffect, useState } from 'react';
import { animate, inView, stagger } from 'motion';
import { Modal } from 'flowbite-react';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import { z } from 'zod';
import { isValidMalaysianPhoneNumberMobile } from '../lib/phoneNumber';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useQueryClient } from 'react-query';
import { format } from 'date-fns';

const Comment = ({
  comment,
  name,
  // likes,
  time,
}: {
  comment: string;
  name: string;
  // likes: number;
  time: string;
}) => {
  return (
    <div className="flex items-center">
      <div className="flex-col">
        <p className="font-semibold text-lg">{comment}</p>
        <p className="text-white/80 text-sm">
          <span className="font-medium">{name}</span>{' '}
          <span className="text-xs text-white/70">{time}</span>
        </p>
      </div>
      <div className="flex items-center ml-auto">
        {/* <span className="text-xs text-white/70 mr-1.5">{likes}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg> */}
      </div>
    </div>
  );
};

const CommentBox = ({ className }: { className?: string }) => {
  const responses = trpc.proxy.summerCamp.promoClipResponses.useQuery(undefined, {});

  return (
    <div
      id="comment-box"
      className={`w-full max-w-2xl min-h-[400px] mt-16 p-4 flex flex-col space-y-4 bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100/25 rounded-lg ${className}`}
    >
      {responses.isLoading ? (
        <div role="status" className="flex min-h-[400px] justify-center items-center">
          <svg
            aria-hidden="true"
            className="mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : responses.isError ? (
        <>Error</>
      ) : responses.data && responses.data.length === 0 ? (
        <div className="min-h-[400px] flex flex-col justify-center items-center">
          <svg width="32" height="32" viewBox="0 0 24 24" className="w-16 h-16 -mb-1">
            <path
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-4.99-5.58-5.34A6.492 6.492 0 0 0 3.03 9h2.02c.24-2.12 1.92-3.8 4.06-3.98C11.65 4.8 14 6.95 14 9.5c0 2.49-2.01 4.5-4.5 4.5c-.17 0-.33-.03-.5-.05v2.02l.01.01c1.8.13 3.47-.47 4.72-1.55l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0c.41-.41.41-1.08 0-1.49L15.5 14z"
            />
            <path
              fill="currentColor"
              d="M6.12 11.17L4 13.29l-2.12-2.12c-.2-.2-.51-.2-.71 0c-.2.2-.2.51 0 .71L3.29 14l-2.12 2.12c-.2.2-.2.51 0 .71c.2.2.51.2.71 0L4 14.71l2.12 2.12c.2.2.51.2.71 0c.2-.2.2-.51 0-.71L4.71 14l2.12-2.12c.2-.2.2-.51 0-.71a.513.513 0 0 0-.71 0z"
            />
          </svg>
          <span className="font-medium text-xl">Opps! There are no comments yet.</span>
          <span className="text-sm text-white/70">which means you can be the first!</span>
        </div>
      ) : (
        responses.data &&
        responses.data
          .filter((r) => !!r.comment)
          .map((response) => (
            <Comment
              key={response.id}
              name={response.name}
              comment={response.comment!}
              time={format(response.createdAt, '@ h:mm a · MMM d, yyyy')}
            />
          ))
      )}
    </div>
  );
};

const ResponseFormSchema = z.object({
  name: z.string().min(3),
  phoneNumber: z
    .string()
    .refine(isValidMalaysianPhoneNumberMobile, 'must be a valid Malaysian phone number'),
  comment: z.string().optional(),
  interested: z.boolean().default(false),
});

const Home: NextPage = () => {
  const [open, setOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const queryClient = useQueryClient();
  const submitResponse = trpc.proxy.summerCamp.submitResponse.useMutation({
    onSuccess: () => {
      queryClient.refetchQueries(['summerCamp.promoClipResponses']);
    },
    onError: () => {
      alert('An error occured while submitting your comment. Please try again later.');
    },
  });

  const formik = useFormik<z.infer<typeof ResponseFormSchema>>({
    validationSchema: toFormikValidationSchema(ResponseFormSchema),
    initialValues: {
      name: '',
      phoneNumber: '',
      comment: '',
      interested: false,
    },
    onSubmit: async (values) => {
      // await new Promise((r) => setTimeout(r, 2000));
      await submitResponse.mutateAsync(values);
      setOpen(false);
    },
  });

  useEffect(() => {
    animate('.logo-container', { opacity: [0, 1] }, { duration: 1.5 });
    animate('.text *', { opacity: [0, 1], y: [50, 0] }, { duration: 1.5, delay: stagger(0.3) });

    inView('#comment-box', () => {
      animate(
        '#comment-box *',
        { opacity: [0, 1], y: [20, 0] },
        { duration: 1, easing: 'ease-in-out', delay: stagger(0.1) }
      );
    });
  }, []);

  const onEnd: YouTubeProps['onEnd'] = () => {
    setFinished(true);
    setOpen(true);
  };

  const onClose = () => setOpen(false);

  return (
    <>
      <Head>
        <title>FGACYC - 夏日出逃</title>
        <meta name="description" content="FGACYC 夏日出逃" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="overflow-x-hidden">
        <video
          className="w-screen h-[50vh] object-cover object-top"
          autoPlay={true}
          muted={true}
          playsInline={true}
          loop={true}
          src="/summer-bg.mp4"
        />
        <div
          className="w-full h-[50vh] bg-transparent absolute left-0 top-0"
          style={{ backgroundImage: 'linear-gradient(180deg, #fcb04500 0%, #fcb045 100%)' }}
        />

        <div className="logo-container w-full flex justify-center absolute top-24 left-1/2 -translate-x-1/2 container">
          <img
            className="logo absolute w-[51%] sm:w-[21%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            src="/CYC_Logo_Circle.png"
            alt="Logo"
          />
          <img
            className="logo-ring w-[57%] sm:w-[24%]"
            src="/CYC_Logo_PKRG.png"
            style={{ animation: 'spin 48s linear infinite' }}
            alt="Logo Ring"
          />
        </div>

        <div
          className="bg-transparent"
          style={{ backgroundImage: 'linear-gradient(180deg, #fcb045 0%, #fd1d1d 100%)' }}
        >
          <main className="container flex flex-col items-center justify-center pt-16 pb-28 p-4 mx-auto text-white">
            <div className="text flex flex-col justify-center items-center">
              <h1 className="text-6xl font-bold">夏日出逃</h1>
              <p className="pt-8 font-nunito font-black text-3xl">Let&apos;s take a break!</p>
              <p className="pt-4 font-nunito font-bold text-center max-w-[450px]">
                YTHX22 was one for the books, and whether you weren’t able to join us or just want
                to relive your favorite moments from the weekend, this is your one-stop shop.
              </p>
            </div>

            <Youtube
              videoId="_t5WzsG0wjU"
              opts={{ playerVars: { autoplay: 1 } }}
              // onReady={onReady}
              onEnd={onEnd}
              className="w-full sm:w-[600px] md:w-[800px] lg:w-[1000px] flex justify-center items-center"
              iframeClassName="mt-16"
            />

            <CommentBox />
          </main>
        </div>
      </div>

      {!open && (
        <div
          id="toast-danger"
          className={[
            'fixed bottom-4 sm:right-4 flex items-center p-4 w-4/5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:w-full sm:max-w-md text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800',
            finished
              ? 'animate-[toast-bounce-mobile_1s_infinite] sm:animate-[toast-bounce-desktop_1s_infinite]'
              : '',
          ].join(' ')}
          role="alert"
        >
          <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            <span className="sr-only">Error icon</span>
          </div>
          <div className="ml-3 text-sm font-normal">
            {finished ? (
              <button onClick={() => setOpen(true)}>Click me to leave your feedback!</button>
            ) : (
              'Will be unlocked after watching the video.'
            )}
          </div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            data-dismiss-target="#toast-danger"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      )}

      <Transition appear show={open} as={Fragment}>
        <Dialog onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div
            tabIndex={-1}
            aria-hidden="true"
            className="overflow-y-auto overflow-x-hidden flex justify-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full"
          >
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div className="flex justify-between items-start pt-4 px-4 rounded-t">
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={onClose}
                    >
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="p-6 space-y-6">
                      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 whitespace-pre-wrap sm:whitespace-normal">
                        {`Thanks for watching!\nLet us know what you think below 👇🏼`}
                      </p>
                      <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ${
                              formik.errors.name
                                ? 'focus:ring-red-500 focus:border-red-500'
                                : 'focus:ring-blue-500 focus:border-blue-500'
                            } block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                            placeholder="John Doe"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            disabled={formik.isSubmitting}
                            required
                          />
                          {formik.errors.name && formik.touched.name && (
                            <span className="text-red-600 text-xs mt-1">{formik.errors.name}</span>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Phone number
                          </label>
                          <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange}
                            disabled={formik.isSubmitting}
                            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ${
                              formik.errors.phoneNumber
                                ? 'focus:ring-red-500 focus:border-red-500'
                                : 'focus:ring-blue-500 focus:border-blue-500'
                            } block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                            placeholder="012-345 6789"
                            required
                          />
                          {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                            <span className="text-red-600 text-xs mt-1">
                              {formik.errors.phoneNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="comment"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                        >
                          Comment
                        </label>
                        <textarea
                          id="comment"
                          name="comment"
                          rows={4}
                          className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ${
                            formik.errors.comment
                              ? 'focus:ring-red-500 focus:border-red-500'
                              : 'focus:ring-blue-500 focus:border-blue-500'
                          } dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                          placeholder="Your comment..."
                          value={formik.values.comment}
                          onChange={formik.handleChange}
                          disabled={formik.isSubmitting}
                        />
                        {formik.errors.comment && formik.touched.comment && (
                          <span className="text-red-600 text-xs mt-1">{formik.errors.comment}</span>
                        )}
                      </div>
                      <div className="flex items-center mb-4">
                        <input
                          id="default-checkbox"
                          type="checkbox"
                          name="interested"
                          onChange={formik.handleChange}
                          disabled={formik.isSubmitting}
                          className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="default-checkbox"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Are you interested to join?
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                      <button
                        type="submit"
                        className="flex justify-center items-center min-w-[87px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-70 disabled:pointer-events-none"
                        disabled={formik.isSubmitting || Object.values(formik.errors).length !== 0}
                      >
                        {formik.isSubmitting ? (
                          <div role="status">
                            <svg
                              aria-hidden="true"
                              className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          'Submit'
                        )}
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                        onClick={onClose}
                        disabled={formik.isSubmitting}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Home;
