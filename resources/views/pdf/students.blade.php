<!DOCTYPE html>
<html>
<head>
    <style>
        /* =========================
           SCREEN STYLES (PREVIEW)
           ========================= */
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 13px;
            color: #333;
            padding: 20px;
            background: #f3f4f6;
        }

        /* ✅ Centered container like max-w-2xl */
        .page-container {
            max-width: 672px; /* ≈ Tailwind max-w-2xl */
            margin: 0 auto;
            background: white;
            padding: 20px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .header img {
            width: 100%;
            height: auto;
            margin-top: 10px;
        }

        .title {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }


        .data-table th {
            background: #2e7d32;
            color: white;
            padding: 8px;
            text-align: start;
        }

        .data-table td {
            padding: 8px;
            text-align: start;
        }

        .data-table tr:nth-child(even) {
            background: #f9f9f9;
        }

        /* Hide footer in preview */
        .footer-fixed {
            display: none;
        }

        .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #22c55e;
            color: white;
            padding: 10px 16px;
            font-size: 14px;
            
            border: none;
            border-radius: 6px;
            cursor: pointer;
            z-index: 2000;
        }

        .close-btn {
            position: fixed;
            top: 20px;
            right: 100px; /* Adjusted to be beside print button */
            background-color: #ef4444;
            color: white;
            padding: 10px 14px;
            font-size: 14px;
            
            border: none;
            border-radius: 6px;
            cursor: pointer;
            z-index: 2000;
        }
        
        /* =========================
           PRINT STYLES (DOMPDF)
           ========================= */
        @media print {

            @page {
                /* size: A4; */
                margin: 0;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-size: 11px;
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            /* ❗ Remove container constraints in print */
            .page-container {
                max-width: none;
                margin: 0;
                padding: 0;
                box-shadow: none;
            }

            .footer-fixed {
                display: block;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 1in;
                z-index: 1000;
                background-color: white;
            }

            .footer-fixed img {
                width: 100%;
                display: block;
            }

            thead {
                display: table-header-group;
            }

            tfoot {
                display: table-footer-group;
            }

            .tfoot-spacer {
                height: 1in;
                visibility: hidden;
            }

            .data-table th {
                background: #2e7d32;
                color: white;
                text-align: left;
                border: 1px solid #000;
                padding: 5px;
                white-space: nowrap;
                font-size: x-small;
            }

            .data-table td {
                border: 1px solid #000;
                padding: 5px;
                font-size: xx-small;
                 white-space: nowrap;
            }

            .data-table tr {
                page-break-inside: avoid;
            }

            .data-table tr:nth-child(even) {
                background: #f5f5f5;
            }

            .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>

<div class="footer-fixed">
    <img src="{{ asset('footer.png') }}" alt="Footer">
</div>

{{-- <button class="no-print print-btn" onclick="window.print()">
    Print
</button>

<button class="no-print close-btn" onclick="closeTab()">✕</button> --}}

<!-- ✅ CENTERED WRAPPER -->
<div class="page-container">

    <table>
        <thead>
            <tr>
                <td>
                    <div class="header">
                        <img src="{{ asset('header.png') }}" alt="Header">
                    </div>

                    <div class="title" style="padding-inline: 10mm;">
                        <h2 style="font-size: medium; text-align: center;">Students List</h2>
                       <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                         <small>
                            Generated by: {{ Auth::user()->email }}
                        </small>
                         <small>
                             Generated at: {{ now()->format('F d, Y') }}
                        </small>
                       </div>
                    </div>
                </td>
            </tr>
        </thead>

        <tbody>
            <tr>
                <td style="padding-inline: 10mm;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Course</th>
                                <th>Year</th>
                                <th>Campus</th>
                                <th>Equity Target Indicator</th>
                                <th>Status</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($students as $index => $student)
                                <tr>
                                    <td>{{ $index + 1 }}</td>
                                   
                                   <td>
                                        {{ collect([
                                            $student->fname,
                                            $student->mname ? substr($student->mname, 0, 1) . '.' : null,
                                            $student->lname,
                                            $student->suffix
                                        ])->filter()->implode(' ')}}
                                    </td>
                                    <td>{{ $student->student_type }}</td>
                                    <td>{{ $student->course }}</td>
                                    <td>{{ $student->year_level }}</td>
                                    <td>{{ $student->campus }}</td>
                                    <td>{{ $student->equity_indicator }}</td>
                                   <td
                                        @if($student->status == 'Declined') style="color: red;"
                                        @elseif($student->status == 'Accepted') style="color: green;"
                                        @endif>
                                        {{ $student->status }}
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>

        <tfoot>
            <tr>
                <td>
                    <div class="tfoot-spacer"></div>
                </td>
            </tr>
        </tfoot>
    </table>

</div>

<script>
    // Don't auto-print immediately - let user decide or uncomment if needed
    window.onload = function () {
        setTimeout(() => {
            window.print();
        }, 100);
    };

    function closeTab() {
        // Try multiple methods to close the window/tab
        if (window.close()) {
            window.close();
        }
        
        // Attempt to close using window.open with self reference
        try {
            window.open('', '_self', '');
            window.close();
        } catch(e) {
            console.log('Close method 1 failed');
        }
        
        // Alternative for some browsers
        try {
            window.top.close();
        } catch(e) {
            console.log('Close method 2 failed');
        }
        
        // Show message if browser prevents closing (for tabs opened by user)
        setTimeout(function() {
            alert("If this window didn't close automatically, please close it manually. Browsers restrict automatic closing of tabs that weren't opened by script.");
        }, 100);
    }
    
    // Optional: close after print if desired
    window.onafterprint = function () {
        // Uncomment below if you want auto-close after printing
        closeTab();
    };
</script>

</body>
</html>