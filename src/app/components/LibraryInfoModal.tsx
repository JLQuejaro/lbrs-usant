"use client";

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface LibraryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'rules' | 'hours';
}

export default function LibraryInfoModal({ isOpen, onClose, type }: LibraryInfoModalProps) {
  // Handle ESC key press for accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAcknowledge = () => {
    localStorage.setItem(`library-${type}-acknowledged`, 'true');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-usant-red to-usant-orange p-6 flex items-center justify-between border-b-4 border-white/20">
          <h2 id="modal-title" className="text-2xl font-bold text-white flex items-center gap-3">
            {type === 'rules' ? 'LIBRARY POLICIES & REGULATIONS' : 'LIBRARY HOURS & SCHEDULE'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 lg:p-8">
          {type === 'rules' ? (
            <div className="space-y-6 text-gray-800">
              
              <section className="bg-red-50 border-l-4 border-usant-red p-5 rounded-r-lg">
                <h3 className="text-xl font-bold text-usant-red mb-3">1. Dress Code & Identification</h3>
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-usant-red mt-1">•</span>
                    <span>Students must be in <strong>proper uniform</strong> and present a <strong>valid ID</strong> to enter the library.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-usant-red mt-1">•</span>
                    <span><strong>Grade School, Junior High, and Senior High students</strong> must show their <strong>library card with a photo</strong>.</span>
                  </li>
                </ul>
              </section>

              <section className="bg-orange-50 border-l-4 border-usant-orange p-5 rounded-r-lg">
                <h3 className="text-xl font-bold text-usant-orange mb-3">2. Material Usage Policies</h3>
                <ul className="space-y-3 text-sm leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-usant-orange mt-1">•</span>
                    <div>
                      <strong>General References</strong> (e.g., dictionaries, encyclopedias, atlases) and <strong>Theses/Dissertations</strong> are <strong className="text-red-600">for in-library use only</strong>.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-usant-orange mt-1">•</span>
                    <div>
                      <strong>Reserve Books:</strong> Available for overnight borrowing from <strong>4:00 PM to 9:00 AM</strong> the next day. Late returns incur a <strong className="text-red-600">₱1.00/hour fine</strong>.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-usant-orange mt-1">•</span>
                    <div>
                      <strong>Fiction/Circulation Books:</strong> 3-day loan period. Late returns incur a <strong className="text-red-600">₱9.00/day fine</strong>.
                    </div>
                  </li>
                </ul>
              </section>

              <section className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-r-lg">
                <h3 className="text-xl font-bold text-blue-600 mb-3">3. Borrower Responsibilities</h3>
                <ul className="space-y-3 text-sm leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Borrowers are <strong>fully responsible</strong> for loaned items. Lost or damaged books must be <strong>replaced or paid for</strong> (as arranged with the librarian).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <div>
                      <strong className="text-red-600">Prohibited Actions:</strong> Stealing, defacing, or damaging materials will result in <strong>serious disciplinary action</strong>.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <div>
                      <strong className="text-red-600">Silence Policy:</strong> Noise violations will result in <strong>disciplinary action</strong>.
                    </div>
                  </li>
                </ul>
              </section>

              <section className="bg-green-50 border-l-4 border-green-600 p-5 rounded-r-lg">
                <h3 className="text-xl font-bold text-green-600 mb-3">4. Faculty Exceptions</h3>
                <p className="text-sm leading-relaxed">
                  Only <strong>faculty members</strong> may borrow reference books.
                </p>
              </section>

            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Our library facilities are open to serve the USANT community with extended hours to support your academic needs.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-usant-red to-usant-orange text-white">
                        <th className="px-6 py-4 text-left font-bold">Library</th>
                        <th className="px-6 py-4 text-left font-bold">Time</th>
                        <th className="px-6 py-4 text-left font-bold">Days</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-800">Grade School Library</td>
                        <td className="px-6 py-4 text-gray-700">7:30 AM - 5:00 PM</td>
                        <td className="px-6 py-4 text-gray-700">Monday to Friday</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-800">Junior High School Library</td>
                        <td className="px-6 py-4 text-gray-700">7:30 AM - 5:00 PM</td>
                        <td className="px-6 py-4 text-gray-700">Monday to Friday</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-800">Senior High School Library</td>
                        <td className="px-6 py-4 text-gray-700">7:30 AM - 5:00 PM</td>
                        <td className="px-6 py-4 text-gray-700">Monday to Friday</td>
                      </tr>
                      <tr className="hover:bg-blue-50 transition-colors border-l-4 border-blue-500">
                        <td className="px-6 py-4 font-semibold text-gray-800">College Library</td>
                        <td className="px-6 py-4 text-gray-700">7:30 AM - 5:00 PM</td>
                        <td className="px-6 py-4 text-gray-700 font-semibold">Monday to Saturday</td>
                      </tr>
                      <tr className="hover:bg-blue-50 transition-colors border-l-4 border-blue-500">
                        <td className="px-6 py-4 font-semibold text-gray-800">Graduate School Library</td>
                        <td className="px-6 py-4 text-gray-700">7:30 AM - 5:00 PM</td>
                        <td className="px-6 py-4 text-gray-700 font-semibold">Monday to Saturday</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Hours may vary during holidays, exam periods, and special events. Please check with library staff for updates.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            Please read and acknowledge the {type === 'rules' ? 'policies' : 'schedule'} above.
          </p>
          <button
            onClick={handleAcknowledge}
            className="bg-gradient-to-r from-usant-red to-usant-orange hover:from-red-700 hover:to-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-200"
          >
            Acknowledge
          </button>
        </div>

      </div>
    </div>
  );
}
